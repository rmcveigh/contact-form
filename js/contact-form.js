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
      function stringCheck(word) {
        var elementValue = word;
        var ssnPattern = /^\d{3}-?\d{2}-?\d{4}$/;
        var ccPattern = '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35d{3})d{11})$';
        if (elementValue.match(ssnPattern)) {
          return 'ssn';
        }
        else if (elementValue.match(ccPattern)) {
          return 'ccn';
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

      // This jQuery function add error attr
      // Had to parse this out sense it effects the same elements
      $.fn.addError = function() {
        var $thisElement = $(this);
        var $error = $thisElement.parent().find('.error-msg');
        var $dis = $('#edit-submit:disabled');
        if (!$thisElement.hasClass('error')) {
          $thisElement.addClass('error');
        }
        if ($error.length && !$dis.length) {
          $('#edit-submit').attr('disabled', 'disabled');
        }
      };

      // This jQuery function removes error attr
      // Had to parse this out sense it effects the same elements

      $.fn.removeError = function() {
        var $thisElement = $(this);
        var $error = $thisElement.parent().find('.error-msg');
        var $dis = $('#edit-submit:disabled');
        if ($thisElement.hasClass('error')) {
          $thisElement.removeClass('error');
        }
        if (!$error.length && $dis.length) {
          $('#edit-submit').removeAttr('disabled')
        }
      };

      // This jQuery function checks for a social security and credit card number in the field.
      $.fn.validate = function () {
        var $thisElement = $(this);
        var $thisParent = $thisElement.parent();
        var $ssnError = $thisParent.find('.ssn-error-message');
        var $ccnError = $thisParent.find('.cc-error-message');
        var ssnTest = 0;
        var ccnTest = 0;
        var elementValue = $thisElement.val();
        var split = elementValue.split(' ');
        // Loop through each word in value and run validation functions.
        // Need to loop through each word so no break in loop.
        for(var i = 0; i < split.length; i++) {
          var word= split[i].replace(/\s+/, '');
          var ccVal = stringCheck(word);
          var ssnVal = stringCheck(word);
          if (ssnVal === 'ssn') {
            ssnTest = 1;
          }
          else if (ccVal === 'ccn') {
            ccnTest = 1;
          }
        }
        // If ccn is present show warning.
        if (ccnTest === 1 && !$ccnError.length) {
          $thisParent.append('<p style="color: red;" class="cc-error-message error-msg">Please remove the credit card number.<p>');
          $thisElement.addError();
        }
        else if (ccnTest !== 1 && $ccnError.length) {
          $ccnError.remove();
          $thisElement.removeError();
        }
        // If ssn is present show warning.
        if (ssnTest === 1 && !$ssnError.length) {
          $thisParent.append('<p style="color: red;" class="ssn-error-message error-msg">Please remove the 9 digit social security number.<p>');
          $thisElement.addError();
        }
        else if (ssnTest !== 1 && $ssnError.length) {
          $ssnError.remove();
          $thisElement.removeError();
        }
      }

      // This jQuery function checks for a email in a field.
      $.fn.emailValidate = function (){
        var $thisElement = $(this);
        var $thisParent = $thisElement.parent();
        var $errorText = $thisParent.find('.email-error-message');
        var email = $thisElement.val();
        var emailValue = checkEmail(email);
        // If it does not pass validation send the user a warning.
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

      // Validating all text areas and text inputs except the email on the contact
      // form when the values are changed.
      $('#contact-us-form textarea, #contact-us-form input[type="text"]')
      .not('#edit-contact-info-email')
      .change(function() {
        $(this).validate();
      });

      // Validate the email text area when changed
      $('#edit-contact-info-email').change(function() {
        $(this).emailValidate();
      });

    }
  };

})(jQuery, Drupal, this, this.document);

