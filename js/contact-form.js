/**
 * @file
 * A JavaScript file for the contact_form module.
 * This js is used for form validation.
 * NOTE: The minified version of this file is loaded. This file is here for dev only.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth

(function ($, Drupal, window, document, undefined) {
  'use strict';

  // To understand behaviors, see https://drupal.org/node/756722#behaviors
  Drupal.behaviors.formValidation = {
    attach: function (context, settings) { // jshint ignore:line

      // Validator for social security numbers
      function ssnCheck(word) {
        var elementValue = word;
        var ssnPattern = /^\d{3}-?\d{2}-?\d{4}$/;
        if (elementValue.match(ssnPattern)) {
          return true;
        }
        else {
          return false;
        }
      }

      // Validator for credit card numbers
      function ccCheck(word) {
        var elementValue = word;
        var ccPattern = '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35d{3})d{11})$';
        if (elementValue.match(ccPattern)) {
          return true;
        }
        else {
          return false;
        }
      }

      // Validator for email
      function checkEmail(email) {
          var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (email.match(re)) {
            return true;
          }
          else {
            return false;
          }
      }


      // This jQuery function checks for a social security number in the field.
      $.fn.ssnValidate = function () {
        var $thisElement = $(this);
        var $thisParent = $thisElement.parent();
        var $errorText = $thisParent.find('.ssn-error-message');
        var booleonTest = 0;
        var elementValue = $thisElement.val();
        var split = elementValue.split(' ');
        for(var i = 0; i < split.length; i++) {
          var word= split[i].replace(/\s+/, '');
          var ssnVal = ssnCheck(word);
          if (ssnVal === true) {
            booleonTest = 1;
            break;
          }
        }
        if (booleonTest === 1) {
          $thisElement.addClass('error');
          $('#edit-submit').attr('disabled', 'disabled');
          if (!$errorText.length) {
            $thisParent.append('<p style="color: red;" class="ssn-error-message">Please remove the 9 digit social security number.<p>');
          }
        }
        else {
          $thisElement.removeClass('error');
          $('#edit-submit').removeAttr('disabled');
          if ($errorText.length) {
            $errorText.remove();
          }
        }
      }

      // This jQuery function checks for a social security number in the field.
      $.fn.ccValidate = function () {
        var $thisElement = $(this);
        var $thisParent = $thisElement.parent();
        var $errorText = $thisParent.find('.cc-error-message');
        var booleonTest = 0;
        var elementValue = $thisElement.val();
        var split = elementValue.split(' ');
        for(var i = 0; i < split.length; i++) {
          var word= split[i].replace(/\s+/, '');
          var ccVal = ccCheck(word);
          if (ccVal === true) {
            booleonTest = 1;
            break;
          }
        }
        if (booleonTest === 1) {
          $thisElement.addClass('error');
          $('#edit-submit').attr('disabled', 'disabled');
          if (!$errorText.length) {
            $thisParent.append('<p style="color: red;" class="cc-error-message">Please remove the credit card number.<p>');
          }
        }
        else {
          $thisElement.removeClass('error');
          $('#edit-submit').removeAttr('disabled');
          if ($errorText.length) {
            $errorText.remove();
          }
        }
      }

      // This jQuery function checks for a email in a field.
      $.fn.emailValidate = function (){
        var $thisElement = $(this);
        var $thisParent = $thisElement.parent();
        var $errorText = $thisParent.find('.email-error-message');
        var email = $thisElement.val();
        var emailValue = checkEmail(email);
        if (emailValue !== true) {
          $thisElement.addClass('error');
          $('#edit-submit').attr('disabled', 'disabled');
          if (!$errorText.length) {
            $thisParent.append('<p style="color: red;" class="email-error-message">Please input a valid email address<p>');
          }
        } else {
          $thisElement.removeClass('error');
          $('#edit-submit').removeAttr('disabled');
          if ($errorText.length) {
            $errorText.remove();
          }
        }
      }

      // Validating all text areas and text inputs on contact form when changed.
      $('#contact-us-form textarea, #contact-us-form input[type="text"]').not('#edit-contact-info-email')
      .change(function() {
        $(this).ssnValidate();
        $(this).ccValidate();
      });

      // Validate the email text area when changed
      $('#edit-contact-info-email').change(function() {
        $(this).emailValidate();
      });

    }
  };


})(jQuery, Drupal, this, this.document);

