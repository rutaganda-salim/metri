/**
 * Pulse Analytics tracking script
 * 
 * This script tracks page views and other analytics data
 * for websites using the Pulse Analytics platform.
 */

(function () {
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

  // Track a page view with retry logic
  const trackPageView = async (retryCount = 3, delay = 1000) => {
    try {
      const visitorId = getVisitorId();
      const referrer = document.referrer;
      const url = window.location.href;
      const path = window.location.pathname;

      // Get screen dimensions
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;

      // Get page title and language
      const title = document.title;
      const language = navigator.language || navigator.userLanguage;

      // Get UTM parameters and traffic source information
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');
      const utmContent = urlParams.get('utm_content');
      const utmTerm = urlParams.get('utm_term');

      const payload = {
        tracking_id: websiteId,
        url: url,
        path: path,
        referrer: referrer,
        visitor_id: visitorId,
        domain: domain || window.location.hostname,
        screen_width: screenWidth,
        screen_height: screenHeight,
        language: language,
        title: title,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        utm_term: utmTerm
      };

      // Retry logic
      for (let i = 0; i < retryCount; i++) {
        try {
          const response = await fetch('https://mgsubqvamygnunlzttsr.supabase.co/functions/v1/track-pageview', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            return; // Success - exit the retry loop
          }

          const errorText = await response.text();
          console.warn(`Pulse Analytics: Attempt ${i + 1}/${retryCount} failed with status ${response.status}: ${errorText}`);

          // If this wasn't the last attempt, wait before retrying
          if (i < retryCount - 1) {
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i))); // Exponential backoff
          }
        } catch (networkError) {
          console.warn(`Pulse Analytics: Network error on attempt ${i + 1}/${retryCount}:`, networkError);

          // If this wasn't the last attempt, wait before retrying
          if (i < retryCount - 1) {
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i))); // Exponential backoff
          }
        }
      }

      throw new Error(`Failed to track page view after ${retryCount} attempts`);
    } catch (e) {
      console.error('Pulse Analytics: Error tracking page view:', e.message);
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
