<?php
/**
 * Use for add user favourite
 */
namespace Wp_Classified_Ads;

/**
 * @uses rest request class
 * 
 */
use WP_REST_Request;
/**
 * Check class exist or not
 * 
 */
if ( ! class_exists( 'Wp_Classified_Add_Ads_Favourite' ) ) {
    /**
     * create class
     */
    class Wp_Classified_Add_Ads_Favourite {
        /**
         * create function for add favourite
         * @param api sended data array( ads_id ), user_id
         * @return success and user id
         */
        public static function wp_classified_ads_add_favourite( WP_REST_Request $data ) { 
            $request = $_SERVER['REQUEST_METHOD'];
            if ( $request == 'POST' ) {
                $datas = $data->get_params();
                if ( ! empty( $datas ) ) {
                    $ads_ids = isset( $datas['ads_id'] ) ?  $datas['ads_id'] : array();
                    $author_id = isset( $datas['author_id'] ) ? $datas['author_id'] : 0;
                    if ( ! empty( $author_id ) && ( int ) $author_id > 0 ) { 
                        $response  = update_user_meta( $author_id, 'wp_classified_ads_added_user_favourite', $ads_ids );
                        if ( ! is_wp_error( $response ) ) {
                            return wp_send_json_success( 'added_favourite_successfully' );
                        } else {
                            return wp_send_json_error( 'not_added' );
                        }
                    } elseif ( empty( $author_id ) || $author_id <= 0 ) {
                        return wp_send_json_error( 'author_id_is_empty' );
                    } else {
                        return wp_send_json_error( 'json_formate_not_valide' );
                    }
                } else  {
                    return wp_send_json_error( 'sorry_your_send_data_is_empty' );
                }
            } else  {
                return wp_send_json_error( 'your_request_is_invalid' );
            }
        }
    }
}