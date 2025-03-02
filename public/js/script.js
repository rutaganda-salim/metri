
/**
 * Pulse Analytics tracking script
 * 
 * This script tracks page views and other analytics data
 * for websites using the Pulse Analytics platform.
 */

(function() {
  // Get script element to extract configuration
  const scriptEl = document.currentScript;
  const websiteId = scriptEl.getAttribute('data-website-id');
  const domain = scriptEl.getAttribute('data-domain');
  
  if (!websiteId) {
    console.error('Pulse Analytics: Missing data-website-id attribute');
    return;
  }

  // Generate a unique visitor ID or retrieve existing one
  const getVisitorId = () => {
    let visitorId = localStorage.getItem('pulse_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('pulse_visitor_id', visitorId);
    }
    return visitorId;
  };

  // Track a page view
  const trackPageView = async () => {
    try {
      const visitorId = getVisitorId();
      const referrer = document.referrer;
      const url = window.location.href;
      const path = window.location.pathname;
      
      // Send tracking data to API
      await fetch('https://mgsubqvamygnunlzttsr.supabase.co/functions/v1/track-pageview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tracking_id: websiteId,
          url: url,
          path: path,
          referrer: referrer,
          visitor_id: visitorId,
          domain: domain || window.location.hostname,
        }),
      });
    } catch (e) {
      console.error('Pulse Analytics: Error tracking page view', e);
    }
  };

  // Track page view on initial load
  trackPageView();

  // Handle navigation changes for SPAs
  let lastUrl = window.location.href;
  
  // Create a new MutationObserver to detect URL changes in SPAs
  const observer = new MutationObserver(() => {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      trackPageView();
    }
  });

  // Start observing the document for changes
  observer.observe(document, { subtree: true, childList: true });

  // Expose the tracking API
  window.pulse = {
    trackEvent: (eventName, eventData) => {
      console.log('Custom event tracking is not implemented yet');
    }
  };
})();
