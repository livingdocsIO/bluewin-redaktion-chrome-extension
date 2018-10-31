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

const mainPopupElement = document.querySelector("#mainPopup");

const actionsListElement = document.querySelector(".actions");

chrome.tabs.getSelected(null, function(tab) {
  const hostConfig = config.hosts.find(hostConfig => {
    return tab.url.startsWith(`https://${hostConfig.hostname}`) || tab.url.startsWith(`http://${hostConfig.hostname}`);
  });

  if (!hostConfig) {
    return;
  }

  const match = tab.url.match(articleRegExIdentifier);

  if (Array.isArray(match)) {
    const id = match[1];
    if (id) {
      const actionElement = document.createElement("li");
      const openInLdLinkElement = document.createElement("a");
      openInLdLinkElement.setAttribute(
        "href",
        `${hostConfig.ldUrl}/articles/${id}`
      );
      openInLdLinkElement.setAttribute("target", "_blank");
      openInLdLinkElement.setAttribute("rel", "noopener");
      openInLdLinkElement.textContent = "in Livingdocs editieren";

      actionElement.appendChild(openInLdLinkElement);
      actionsListElement.appendChild(actionElement);
    }
  }
});
