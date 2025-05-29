// ==UserScript==
// @name         RicZin Proteção Total🔐🔥 (Bloqueio Extremo + Anti-Ad + Anti-Redirect + Dark Mode)
// @namespace    https://viayoo.com/
// @version      9.9.9.9.9.9.9.9.17
// @description  Bloqueia domínios não autorizados, remove anúncios, impede redirecionamentos e força tema escuro nos sites liberados. Retorna para o último site seguro se o atual for suspeito.
// @author       @RicZin7
// @run-at       document-start
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const whitelistSites = [
        "youtube.com", "instagram.com", "facebook.com", "x.com", "twitter.com",
        "khanacademy.org", "pornhub.com", "xvideos.com", "xhamster.com",
        "pinterest.com", "wallpapers.com", "tiktok.com", "google.com", "bing.com",
        "duckduckgo.com", "ecosia.org", "search.brave.com", "yahoo.com",
        "startpage.com", "chatgpt.com", "github.com", "apkcombo.com",
        "tekmods.com", "happymod.com", "uptodown.com"
    ];

    function getDomainFromHost(host) {
        const parts = host.replace(/^www\./, '').split('.');
        if (parts.length >= 2) {
            return parts.slice(-2).join('.');
        }
        return host;
    }

    function isAllowedSite() {
        const host = window.location.hostname;
        const domain = getDomainFromHost(host);
        return whitelistSites.includes(domain);
    }

    const previousURL = sessionStorage.getItem('riczin_previous_url') || document.referrer;

    if (!isAllowedSite()) {
        window.stop();
    }

    function showRicZinBadge() {
        const tag = document.createElement("div");
        tag.textContent = "Proteção 🔐by RicZin";
        Object.assign(tag.style, {
            position: "fixed", top: "10px", right: "10px",
            padding: "8px 16px", zIndex: "99999",
            fontSize: "16px", fontWeight: "bold", fontFamily: "Arial, sans-serif",
            borderRadius: "8px", background: "#000", color: "lime",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)"
        });
        document.body.appendChild(tag);
    }

    function forceDarkMode() {
        const style = document.createElement("style");
        style.textContent = `
            html, body {
                background-color: #121212 !important;
                color: #e0e0e0 !important;
            }
            * {
                background-color: transparent !important;
                border-color: #444 !important;
                color: inherit !important;
            }
            img, video {
                opacity: 0.9 !important;
            }
            a {
                color: #4fc3f7 !important;
            }
            input, textarea, select, button {
                background-color: #1e1e1e !important;
                color: #fff !important;
                border: 1px solid #333 !important;
            }
        `;
        document.head.appendChild(style);
    }

    function preventRedirects() {
        const block = () => console.warn("🔐 Redirecionamento bloqueado por RicZin.");
        const loc = window.location;
        Object.defineProperties(loc, {
            href: { set: block, get: () => loc.toString() },
            assign: { value: block },
            replace: { value: block }
        });
        window.open = () => {
            console.warn("🔐 Abertura de nova aba/janela bloqueada por RicZin.");
            return null;
        };
    }

    function blockAds() {
        const adSelectors = [
            'iframe[src*="ads"]',
            '[id^="ad"], [class^="ad"], [id*="sponsor"], [class*="sponsor"]',
            '[id*="banner"], [class*="banner"]',
            '[class*="adsbox"], .ad-container, .google-ad',
            'a[href*="adclick"], a[href*="doubleclick"], a[href*="utm_source=ads"]',
            'a[href*="track"], a[href*="affiliate"], a[href*="redirect"]'
        ];

        function removeAds() {
            adSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    el.remove();
                    console.warn("🚫 Anúncio ou link suspeito removido.");
                });
            });
        }

        removeAds();
        const adObserver = new MutationObserver(() => removeAds());
        adObserver.observe(document.body, { childList: true, subtree: true });
    }

    if (isAllowedSite()) {
        sessionStorage.setItem('riczin_previous_url', window.location.href);

        window.addEventListener('DOMContentLoaded', () => {
            showRicZinBadge();
            preventRedirects();
            blockAds();
            forceDarkMode();

            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.tagName === 'IFRAME') {
                            node.remove();
                            console.warn("🔐 Iframe bloqueado.");
                        }
                    }
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });

    } else {
        window.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('img, a, script, iframe').forEach(el => el.remove());

            const overlay = document.createElement('div');
            Object.assign(overlay.style, {
                position: 'fixed', top: '0', left: '0',
                width: '100%', height: '100%', zIndex: '999999',
                backgroundImage: "url('https://raw.githubusercontent.com/RICZIN2008/Midia/refs/heads/main/photo.jpg')",
                backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '30px', fontWeight: 'bold', textShadow: '2px 2px 4px black'
            });
            overlay.textContent = "@RicZin7🔥";
            document.body.appendChild(overlay);

            setTimeout(() => {
                if (previousURL && !window.location.href.includes(previousURL)) {
                    window.location.href = previousURL;
                }
            }, 3000);
        });

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.tagName && ['IMG', 'A', 'SCRIPT', 'IFRAME'].includes(node.tagName)) {
                        node.remove();
                    }
                }
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });

        XMLHttpRequest.prototype.open = function () {
            console.warn("XHR bloqueado.");
            return;
        };
        window.fetch = function () {
            console.warn("fetch bloqueado.");
            return new Promise(() => {});
        };
    }
})();
          
