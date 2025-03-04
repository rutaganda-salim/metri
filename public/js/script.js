
/**
 * Metri Analytics tracking script
 * 
 * This script tracks page views and other analytics data
 * for websites using the Metri Analytics platform.
 */

(function () {
  // Get script element to extract configuration
  const scriptEl = document.currentScript;
  if (!scriptEl) {
    console.error('Metri Analytics: Unable to identify script element');
    return;
  }

  const websiteId = scriptEl.getAttribute('data-website-id');
  const domain = scriptEl.getAttribute('data-domain');

  if (!websiteId) {
    console.error('Metri Analytics: Missing data-website-id attribute');
    return;
  }

  // Generate a unique visitor ID or retrieve existing one
  const getVisitorId = () => {
    try {
      let visitorId = localStorage.getItem('metri_visitor_id');
      if (!visitorId) {
        visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('metri_visitor_id', visitorId);
      }
      return visitorId;
    } catch (e) {
      // If localStorage is not available, generate a temporary ID
      return 'visitor_' + Math.random().toString(36).substring(2, 15);
    }
  };

  // Track a page view with simple retry logic
  const trackPageView = async (retryCount = 3, delay = 1000) => {
    try {
      const visitorId = getVisitorId();
      const referrer = document.referrer;
      const url = window.location.href;

      const payload = {
        tracking_id: websiteId,
        url: url,
        referrer: referrer,
        visitor_id: visitorId,
        domain: domain || window.location.hostname
      };

      // Retry logic
      for (let i = 0; i < retryCount; i++) {
        try {
          const response = await fetch('https://mgsubqvamygnunlzttsr.supabase.co/functions/v1/track-pageview', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            console.log('Metri Analytics: Page view tracked successfully');
            return;
          }

          console.warn(`Metri Analytics: Attempt ${i + 1}/${retryCount} failed with status ${response.status}`);
          
          if (i < retryCount - 1) {
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
          }
        } catch (networkError) {
          console.warn(`Metri Analytics: Network error on attempt ${i + 1}/${retryCount}:`, networkError);
          
          if (i < retryCount - 1) {
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
          }
        }
      }
    } catch (e) {
      console.error('Metri Analytics: Error tracking page view:', e.message);
    }
  };

  // Track page view on initial load
  trackPageView();

  // Handle navigation changes for SPAs
  let lastUrl = window.location.href;
  
  try {
    // Create a new MutationObserver to detect URL changes in SPAs
    const observer = new MutationObserver(() => {
      if (lastUrl !== window.location.href) {
        lastUrl = window.location.href;
        trackPageView();
      }
    });

    // Start observing the document for changes
    observer.observe(document, { subtree: true, childList: true });
  } catch (e) {
    console.warn('Metri Analytics: Unable to setup SPA tracking:', e.message);
  }

  // Expose the tracking API
  window.metri = {
    trackEvent: (eventName, eventData) => {
      console.log('Metri Analytics: Custom event tracking is not implemented yet');
    }
  };
})();
