const config = {
  hosts: [
    {
      hostname: "213.3.79.35",
      ldUrl: "https://bluewin-cms.dev.sctv.ch"
    },
    {
      hostname: "bluewin.sta.sctv.ch",
      ldUrl: "https://bluewin-cms.sta.sctv.ch"
    },
    {
      hostname: "www.bluewin.ch",
      ldUrl: "https://bluewin.cms.sctv.ch"
    }
  ]
};

const articleRegExIdentifier = /\-([0-9]*).html/;

function addLdEditLinks(document, hostConfig) {
  const ldLinkElements = Array.prototype.slice
    .call(document.querySelectorAll("a"))
    .filter(linkElement => {
      const url = linkElement.getAttribute("href");

      if (url === null) {
        return false;
      }
      else {
        return (
          (url.startsWith("/") || url.startsWith(`https://${hostConfig.hostname}`)) &&
          url.match(articleRegExIdentifier)
        );
      }
    });

  ldLinkElements.forEach(ldLinkElement => {
    const openInLdLinkElement = document.createElement("a");
    const match = ldLinkElement.getAttribute("href").match(articleRegExIdentifier);

    if (Array.isArray(match)) {
      const id = match[1];

      if (id) {
        openInLdLinkElement.setAttribute(
          "href",
          `${hostConfig.ldUrl}/articles/${id}`
        );
        openInLdLinkElement.setAttribute("target", "_blank");
        openInLdLinkElement.setAttribute("rel", "noopener");

        const ldLogo =
          '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve"><rect fill="#29B96F" width="16" height="16"/><rect x="4.4" y="2.8" fill="#FFFFFF" width="2.4" height="10.4"/><rect x="9.2" y="2.8" fill="#FFFFFF" width="2.4" height="2.4"/><rect x="9.2" y="6" fill="#FFFFFF" width="2.4" height="7.2"/></svg>';

        openInLdLinkElement.style.marginLeft = "5px";
        openInLdLinkElement.innerHTML = `${ldLogo}`;

        ldLinkElement.appendChild(openInLdLinkElement);
      }
    }
  });
}


chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      const hostConfig = config.hosts.find(hostConfig => {
        return hostConfig.hostname === window.location.hostname;
      });

      if (!hostConfig) {
        return;
      }

      try {
        addLdEditLinks(document, hostConfig);
      } catch (e) {
        console.error(
          "Bluewin Redaktion Extension: failed to add edit in LD links",
          e
        );
      }
    }
  }, 10);
});
