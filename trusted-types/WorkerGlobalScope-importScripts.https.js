
let test_setup_policy = TrustedTypes.createPolicy("hurrayanythinggoes", {
  createScriptURL: x => new URL(x, location.href)
});
importScripts(test_setup_policy.createScriptURL("/resources/testharness.js"));


// Determine worker type (for better logging)
let worker_type = "unknown";
if (this.DedicatedWorkerGlobalScope !== undefined) {
  worker_type = "dedicated worker";
} else if (this.SharedWorkerGlobalScope !== undefined) {
  worker_type = "shared worker";
} else if (this.ServiceWorkerGlobalScope !== undefined) {
  worker_type = "service worker";
}

const test_policy = TrustedTypes.createPolicy('xxx', {
  createScriptURL: url => new URL(url.replace("play", "work"), this.location.href) });

test(t => {
  self.result = "Fail";
  let trusted_url = test_policy.createScriptURL(new URL("support/player.js", location.href));
  assert_true(TrustedTypes.isScriptURL(trusted_url));
  importScripts(trusted_url);  // support/worker.js modifies self.result.
  assert_equals(self.result, "Pass");
}, "importScripts with TrustedScriptURL works in " + worker_type);


test(t => {
  let untrusted_url = "support/player.js";
  assert_throws(new TypeError(),
    function() { importScripts(untrusted_url) },
    "importScripts(untrusted_url)");
}, "importScripts with untrusted URLs throws in " + worker_type);

test(t => {
  assert_throws(new TypeError(),
    function() { importScripts(null) },
    "importScripts(null)");
}, "null is not a trusted script URL throws in " + worker_type);

done();

