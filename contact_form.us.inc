<?php

/**
 * Create form.
 */
function contact_us_form($form, &$form_state) {
  $form['#tree'] = TRUE;

  $form['contact_info'] = array(
    '#type' => 'fieldset',
    '#title' => t('Contact Info'),
  );
  $form['contact_info']['first'] = array(
    '#type' => 'textfield',
    '#title' => t('First Name'),
    '#required' => TRUE,
    '#attributes' => array(
      'placeholder' => t('John'),
    ),
  );
  $form['contact_info']['last'] = array(
    '#type' => 'textfield',
    '#title' => t('Last Name'),
    '#required' => TRUE,
    '#attributes' => array(
      'placeholder' => t('Doe'),
    ),
  );
  $form['contact_info']['email'] = array(
    '#type' => 'textfield',
    '#title' => t('Email'),
    '#required' => TRUE,
    '#attributes' => array(
      'placeholder' => t('john.doe@example.com'),
    ),
  );
  $form['message'] = array(
    '#type' => 'fieldset',
    '#title' => t('Message'),
  );
  $form['message']['subject'] = array(
    '#type' => 'textfield',
    '#title' => t('Subject'),
    '#required' => TRUE,
    '#attributes' => array(
      'placeholder' => t('Subject'),
    ),
  );
  $form['message']['body'] = array(
    '#type' => 'textarea',
    '#title' => t('Body'),
    '#required' => TRUE,
    '#attributes' => array(
      'placeholder' => t('Message Body'),
    ),
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
  );
  $form['#attached']['js'] = array(
    drupal_get_path('module', 'contact_form') . '/js/contact-form.min.js',
  );

  return $form;
}

/**
 * Implements hook_form_validate().
 */
function contact_us_form_validate(&$form, &$form_state) {

  // Check if a valid email with used.
  $mail = $form_state['values']['contact_info']['email'];
  if (!valid_email_address($mail)) {
    form_set_error($mail, t('The email address appears to be invalid.'));
  }

  // Check if the message contains a credit card number or ssn
  $subject = $form_state['values']['message']['subject'];
  $subject_has_credit_info = check_for_credit_info($subject);
  $subject_has_ssn_info = check_for_ss_number($subject);

  if ($subject_has_ssn_info || $subject_has_credit_info) {
    form_set_error($subject, t('Please do not include social security numbers or credit card numbers in the subject.'));
  }

  // Check if the body field contains a credit card number or ssn
  $message = $form_state['values']['message']['body'];
  $body_has_credit_info = check_for_credit_info($message);
  $body_has_ssn_info = check_for_ss_number($message);

  if ($body_has_ssn_info || $body_has_credit_info) {
    form_set_error($message, t('Please do not include social security numbers or credit card numbers in the message.'));
  }
}

/**
 * Implements hook_form_submit().
 */
function contact_us_form_submit(&$form, &$form_state) {
  drupal_set_message(
    t('Thank you ' . $form_state['values']['contact_info']['first'] . '. We will respond to you at ' . $form_state['values']['contact_info']['email'] . ' as soon as possible.')
  );
}


function check_for_credit_info($val) {
  $words = explode(' ', $val);
  $returnboolean = 0;
  foreach ($words as $word) {
    if (check_for_ccn($word)) {
      $returnboolean = 1;
    }
  }
  return $returnboolean;
}

function check_for_ss_number($val) {
  $words = explode(' ', $val);
  $returnboolean = 0;
  foreach ($words as $word) {
    if (check_for_ssn($word)) {
      $returnboolean = 1;
    }
  }
  return $returnboolean;
}

/**
 * this will check the string as long as its at least 15 digits long against the
 * first 15 and (perhaps 16) digits against the luhn check.
 * if we get one positive, we $returnboolean indicating that
 */

function check_for_ccn($word) {
  $val = preg_replace("/[^0-9]/", "", $word);
  $returnboolean = 0;

  if (!is_numeric($val)) {
    return 0;
  }
  else {
    settype($val, 'string');

    while (strlen($val) >= 16) {
      if (luhn_check($val)) {
        $returnboolean = 1;
      }
      $val = substr($val, 1);
    }

    return $returnboolean;
  }
}

/**
 * this will check the string as long as its at least 8 digits long against the
 * first 8 and (perhaps 9) digits against the luhn check.
 * if we get one positive, we $returnboolean indicating that
 */

function check_for_ssn($word) {
  $returnboolean = 0;
  settype($word, 'string');

  if ((is_numeric($word) && strlen($word) === 9)
 || preg_match("/^[0-9]{3}-[0-9]{2}-[0-9]{4}$/", $word)) {
    $returnboolean = 1;
  }

  return $returnboolean;
}

/**
 * Luhn algorithm number checker - (c) 2005-2008 shaman - www.planzero.org
 * This code has been released into the public domain, however please give
 * credit to the original author where possible.
 */

function luhn_check($number) {

  // Strip any non-digits (useful for credit card numbers with spaces and hyphens)
  $number=preg_replace('/\D/', '', $number);

  // Set the string length and parity
  $number_length=strlen($number);
  $parity=$number_length % 2;

  // Loop through each digit and do the maths
  $total=0;
  for ($i=0; $i<$number_length; $i++) {
    $digit=$number[$i];
    // Multiply alternate digits by two
    if ($i % 2 == $parity) {
      $digit*=2;
      // If the sum is two digits, add them together (in effect)
      if ($digit > 9) {
        $digit-=9;
      }
    }
    // Total up the digits
    $total+=$digit;
  }

  // If the total mod 10 equals 0, the number is valid
  return ($total % 10 == 0) ? TRUE : FALSE;

}

