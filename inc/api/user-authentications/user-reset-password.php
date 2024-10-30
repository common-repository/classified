<?php
/**
 * @author Wen Solution 
 * use for forgot/reset password
 * 
 */
namespace Wp_Classified_Ads;
/**
 * @uses class of rest request
 * 
 */
use WP_REST_Request;
/**
 * Chekin class available or not
 * 
 */
if ( ! class_exists( 'Wp_Classified_Ads_Reset_Password' ) ) {
    class Wp_Classified_Ads_Reset_Password {
        /**
         * @uses function for accept api rest request
         * @param _nonce and user_email
         * 
         */
        public static function wp_classified_ads_reset_password( WP_REST_Request $user_email ) {
            $user_data = $user_email->get_params();
            $request = isset( $_SERVER['REQUEST_METHOD'] ) ? $_SERVER['REQUEST_METHOD'] : '';
            if  ( $request == 'POST' && ! empty( $user_data ) ) {
                $emails = isset( $user_data['user_email'] ) ? $user_data['user_email'] : '';
                if ( ! empty( $emails ) ) {
                    $res = retrieve_password( $emails );
                    if ( ! is_wp_error( $res ) && $res ) {
                        return wp_send_json_success( 'rest_password_link_send_success' );
                    } else {
                        if ( email_exists( $emails ) ) {
                            return wp_send_json_error( 'your_wp_mail_setup_not_working' );
                        } else {
                            return wp_send_json_error( 'email_does_not_match' );
                        }
                    }
                } else {
                    return wp_send_json_error( 'email_empty' );
                }
            } else {
                return wp_send_json_error( 'request_type_invalied' );
            }
        }
        /**
         * Redirect user after reset password
         * 
         */
        public static function wp_classfied_user_redirect_after_reset_password() {
            wp_redirect( home_url() ); 
            exit;
        }
    }
}