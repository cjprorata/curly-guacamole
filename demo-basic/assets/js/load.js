 (function () {
    tp = window["tp"] || [];

    /* Checkout related */
    /**
     * Event properties
     *
     * chargeAmount - amount of purchase
     * chargeCurrency
     * uid
     * email
     * expires
     * rid
     * startedAt
     * termConversionId
     * termId
     * promotionId
     * token_list
     * cookie_domain
     * user_token
     *
     */
    function onCheckoutComplete(data) {
    }

    function onCheckoutExternalEvent() {
    }

    function onCheckoutClose(event) {
      /* Default behavior is to refresh the page on successful checkout */
      if (event && event.state == "checkoutCompleted") {
        setTimeout(() => {
          tp.template.show({
            templateId: "OTER8E5BXY44",
            displayMode: "modal",
            showCloseButton: false,
            close: function() {
              location.reload();
            }
          });
        }, 250);
      }
    }

    function onCheckoutCancel() {
    }

    function onCheckoutError() {
    }

    /* Meter callback */
    function onMeterExpired() {

    }

    /* Meter callback */
    function onMeterActive() {

    }

    /* Callback executed after a tinypassAccounts login */
    function onLoginSuccess() {
    }

    /* Callback executed after an experience executed successfully */
    function onExperienceExecute(event) {
    }

    /* Callback executed if experience execution has been failed */
    function onExperienceExecutionFailed(event) {
    }

    tp.push(["setAid", '6LaRkvUre6']);
  	tp.push(["setCxenseSiteId", "1139713318437283195"])
    tp.push(["setEndpoint", 'https://buy.tinypass.com/api/v3']);
    tp.push(["setUseTinypassAccounts", false ]);
    tp.push(["setUsePianoIdUserProvider", true ]);

    /* checkout related events */
    tp.push(["addHandler", "checkoutComplete", onCheckoutComplete]);
    tp.push(["addHandler", "checkoutClose", onCheckoutClose]);
    tp.push(["addHandler", "checkoutCustomEvent", onCheckoutExternalEvent]);
    tp.push(["addHandler", "checkoutCancel", onCheckoutCancel]);
    tp.push(["addHandler", "checkoutError", onCheckoutError]);


    /* user login events */
    tp.push(["addHandler", "loginSuccess", onLoginSuccess]);

    /* meter related */
    tp.push(["addHandler", "meterExpired", onMeterExpired]);
    tp.push(["addHandler", "meterActive", onMeterActive]);

    tp.push(["addHandler", "experienceExecute", onExperienceExecute]);
    tp.push(["addHandler", "experienceExecutionFailed", onExperienceExecutionFailed]);

    tp.push(["init", function () {
        tp.pianoId.init({});
      	// Auto-password reset form initialization
        var tokenMatch = location.search.match(/reset_token=([A-Za-z0-9]+)/);
        if (tokenMatch) {
          var token = tokenMatch[1];
          tp.pianoId.show({'resetPasswordToken':token});
        }
        tp.experience.init();
    }]);
})();


    // do not change this section
    // |BEGIN INCLUDE TINYPASS JS|
    (function(src){var a=document.createElement("script");a.type="text/javascript";a.async=true;a.src=src;var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)})("//cdn.tinypass.com/api/tinypass.min.js");
    // |END   INCLUDE TINYPASS JS|

