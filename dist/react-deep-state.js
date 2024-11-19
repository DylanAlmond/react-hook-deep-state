import { useState as S, useCallback as b } from "react";
function m(f) {
  const [l, p] = S(f || {}), c = (r) => r !== null && typeof r == "object" && !Array.isArray(r), y = b(
    (r, o, a = !0) => {
      p((u) => {
        const n = r.split("."), i = { ...u };
        let t = i;
        for (let s = 0; s < n.length; s++) {
          const e = n[s];
          if (typeof e == "symbol")
            throw new Error("Symbol keys are not supported");
          s === n.length - 1 ? a || !c(o) ? t[e] = o : t[e] = { ...t[e], ...o } : (c(t[e]) || (t[e] = {}), t = t[e]);
        }
        return i;
      });
    },
    []
  );
  return [l, y];
}
export {
  m as useDeepState
};
