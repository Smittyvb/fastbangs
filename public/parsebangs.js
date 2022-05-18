// SPDX-License-Identifier: Apache-2.0
const BANG_REGEX = /(!([a-z0-9]+([ \t\r\n\f\u00A0]|$)))/;
function getBang(s) {
    s = s.toLowerCase();
    const matches = s.match(BANG_REGEX);
    if (!matches) return null;
    const bang = matches[0].trim().slice(1);
    return bang;
}
if (typeof window !== "undefined") {
    // running in main thread
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js");
    } else {
        // TODO: warn about no SW
    }
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
        const bangsDataPromise = fetch("bangs.json").then(res => res.json());
        const bangText = getBang(q);
        if (bangText) {
            (async () => {
                const bangsData = await bangsDataPromise;
                const bang = bangsData.filter(bang => bang.t === bangText)[0];
                if (bang) {
                    location.href = bang.u.replace(/{{{s}}}/g, q);
                }
            })();
        }
    }
}
