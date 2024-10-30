<?php
/**
 * create for helping user request and give responce
 * 
 */
namespace Wp_Classified_Ads;

use JetBrains\PhpStorm\Internal\ReturnTypeContract;

if ( ! class_exists( 'WP_Classified_User_Helper') ) {
    class WP_Classified_User_Helper {
        /**
         * user to create user
         * @param arry() of user data.
         * @return user id with responce
         */
        public function classified_create_user( $user_data = array(), $profile_pic = array() ) {
            $user_data              = maybe_unserialize( $user_data );
            $email                  = isset( $user_data['email'] ) ? $user_data['email'] : '';
            $password               = isset( $user_data['password'] ) ? $user_data['password'] : '';
            $fname                  = isset( $user_data['fname'] ) ? $user_data['fname'] : '';
            // $mname                  = isset( $user_data['mname'] ) ? $user_data['mname'] : '';
            $lname                  = isset( $user_data['lname'] ) ? $user_data['lname'] : '';
            $phone_number           = isset( $user_data['phone_number'] ) ? $user_data['phone_number'] : '';
            $address                = isset( $user_data['address'] ) ? $user_data['address'] : '';
            $username               = isset( $user_data['username'] ) ?  $user_data['username'] : '';

            if ( ! empty( $email ) && ! empty( $username ) && ! empty( $password ) ) {
           
                $username_exists = $this->classified_username_exist( $username);
                $email_exists = $this->classified_user_email_exist( $email );
                if ( $username_exists ) {
                    return wp_send_json_error('username_already_exists');
                }elseif ( $email_exists ) {
                    return wp_send_json_error('email_already_exists');
                } else { 
                    $user_info = array(
                        'user_pass'             => $password,
                        'user_email'            => $email,
                        'first_name'            => $fname,
                        'last_name'             => $lname,
                        'role'                  => 'wp-classified-customer',
                        'nickname'              => $fname,
                        'display_name'          => $fname . ' ' . $lname,
                        'user_login'            =>  $username,
                        'meta_input'            => array(
                            'classified_ads_user_address'           => $address,
                            'classified_ads_user_phone_number'      => $phone_number
                        )
                    );
                    
                    $user_id = wp_insert_user($user_info );
                    $image_url = '';
                    if ( ! empty( $profile_pic ) ) {
                        // $profile_pic
                        if ( ! function_exists( 'wp_handle_upload' ) ) {
                            require_once( ABSPATH . 'wp-admin/includes/file.php' );
                        }
                        $upload_overrides = array( 'test_form' => false );
                        $uploadedfile = array(
                            'name'     => isset( $profile_pic['name'] ) ? $profile_pic['name'] : '',
                            'type'     => isset( $profile_pic['type'] ) ?  $profile_pic['type'] : '',
                            'tmp_name' => isset( $profile_pic['tmp_name'] ) ?  $profile_pic['tmp_name'] : '',
                            'error'    => isset( $profile_pic['error'] ) ? $profile_pic['error'] : 0,
                            'size'     => isset( $profile_pic['size'] ) ? $profile_pic['size'] : 0 
                        );
                        $upload = wp_handle_upload( $uploadedfile, $upload_overrides );
                        if ( ! is_wp_error( $upload ) ) { 
                            $attachment_id = wp_insert_attachment(
                                array(
                                    'guid'           => $upload[ 'url' ],
                                    'post_mime_type' => $upload[ 'type' ],
                                    'post_title'     => basename( $upload[ 'file' ] ),
                                    'post_content'   => '',
                                    'post_status'    => 'inherit',
                                ),
                                $upload[ 'file' ]
                            );
                            if ( ! is_wp_error( $attachment_id ) && $attachment_id > 0 ) {
                                $image_url = wp_get_attachment_image_url( $attachment_id );
                                $user_data['prifile_image'] =  $image_url;
                                update_user_meta( $user_id, 'wp_classified_user_profile_image_id', $attachment_id );
                                update_user_meta( $user_id, 'wp_classified_user_profile_image_url', $image_url );
                            }
                        }
                    }
                    $responce = array( 
                        'id' => $user_id,
                        'user_details'  => $user_data
                    );
                    return wp_send_json_success($responce);
                }
            } else {
                $responce = 'username_email_and_password_is_required.';
                return wp_send_json_error( $responce );
            }
        }
        /**
         * user to update user data
         * @param arry() of user data.
         * @return user id with responce
         */
        public function classified_update_user( $user_id = 0, $user_data = array(), $profile_pic = array() ) {
            $email                  = isset( $user_data['email'] ) ? $user_data['email'] : '';
            $password               = isset( $user_data['password'] ) ? $user_data['password'] : '';
            $fname                  = isset( $user_data['fname'] ) ? $user_data['fname'] : '';
            // $mname                  = isset( $user_data['mname'] ) ? $user_data['mname'] : '';
            $lname                  = isset( $user_data['lname'] ) ? $user_data['lname'] : '';
            $phone_number           = isset( $user_data['phone_number'] ) ? $user_data['phone_number'] : '';
            $address                = isset( $user_data['address'] ) ? $user_data['address'] : '';
            $username               = isset( $user_data['username'] ) ?  $user_data['username'] : '';

            if ( $user_id > 0 && ! empty( $email ) && ! empty( $username ) && ! empty( $password ) ) {
 
                $user_info = array(
                    'ID'                    => $user_id,
                    'user_pass'             => $password,
                    'user_email'            => $email,
                    'first_name'            => $fname,
                    'last_name'             => $lname,
                    'nickname'              => $fname,
                    'display_name'          => $fname . ' ' . $lname,
                    'user_login'            =>  $username,
                    'meta_input'            => array(
                        'classified_ads_user_address'           => $address,
                        'classified_ads_user_phone_number'      => $phone_number
                    )
                );
                
                $user_ids = wp_update_user($user_info );
                $image_url = '';
                if ( ! is_wp_error( $user_ids ) ) {
                    if ( ! empty( $profile_pic ) && isset( $profile_pic['name'] ) ) {
                        // $profile_pic
                        if ( ! function_exists( 'wp_handle_upload' ) ) {
                            require_once( ABSPATH . 'wp-admin/includes/file.php' );
                        }
                        $upload_overrides = array( 'test_form' => false );
                        $uploadedfile = array(
                            'name'     => isset( $profile_pic['name'] ) ? $profile_pic['name'] : '',
                            'type'     => isset( $profile_pic['type'] ) ?  $profile_pic['type'] : '',
                            'tmp_name' => isset( $profile_pic['tmp_name'] ) ?  $profile_pic['tmp_name'] : '',
                            'error'    => isset( $profile_pic['error'] ) ? $profile_pic['error'] : 0,
                            'size'     => isset( $profile_pic['size'] ) ? $profile_pic['size'] : 0 
                        );
                        $upload = wp_handle_upload( $uploadedfile, $upload_overrides );
                        if ( ! is_wp_error( $upload ) ) { 
                            $attachment_id = wp_insert_attachment(
                                array(
                                    'guid'           => $upload[ 'url' ],
                                    'post_mime_type' => $upload[ 'type' ],
                                    'post_title'     => basename( $upload[ 'file' ] ),
                                    'post_content'   => '',
                                    'post_status'    => 'inherit',
                                ),
                                $upload[ 'file' ]
                            );
                            if ( ! is_wp_error( $attachment_id ) && $attachment_id > 0 ) {
                                $image_url = wp_get_attachment_image_url( $attachment_id );
                                $user_data['prifile_image'] =  $image_url;
                                update_user_meta( $user_id, 'wp_classified_user_profile_image_id', $attachment_id );
                                update_user_meta( $user_id, 'wp_classified_user_profile_image_url', $image_url );
                            }
                        }
                    }
                    $responce = array( 
                        'id' => $user_id,
                        'user_details'  => $user_data
                    );
                    return wp_send_json_success( $responce );
                } else {
                    return wp_send_json_error( 'user_data_not_update' );
                }
            } else {
                return wp_send_json_error( 'user_id_not_valied' );
            }
        }
        /**
         * check username exist or not
         */
        public function classified_username_exist( $username = '' ) {
            if ( username_exists( $username ) ) {
                return true;
            } else {
                return false;
            }
        }
        /**
         * check email exist or not
         */
        public function classified_user_email_exist( $email = '' ) {
            if ( email_exists( $email ) ) {
                return true;
            } else {
                return false;
            }
        }
        /**
         * user login
         * @param arry() of user data.
         * @return user id with responce
         */
        public function classified_user_logins( $user_request ) {
            $username       = isset( $user_request['username'] ) ? $user_request['username'] : '';
            $email          = isset( $user_request['email'] ) ? $user_request['email'] : '';
            $password       = isset( $user_request['password'] ) ? $user_request['password'] : '';
            $nonce          = isset( $user_request['user_nonce'] ) ? $user_request['user_nonce'] : '';
            if (  ! empty( $nonce ) && ! empty( $password ) && ! empty( $username ) ) {
                if ( wp_verify_nonce( $nonce, 'wp_rest' ) ) {
                    $user_response = wp_authenticate( $username, $password );
            
                    if ( is_wp_error( $user_response ) ) {
                        $user_exist = $this->classified_username_exist( $username );
                        if ( $user_exist ) {
                            return 'password_not_match';
                        } else {
                            return "username_password_not_match";
                        }
                    } else {
                        $user_login = wp_signon( array(
                            'user_login'    => $username,
                            'user_pass'     => $password
                        ));
                        $user_data = $user_response->data;
                        $user_id    = $user_data->ID;
                        $this->classified_user_cookie_set( $user_id, $nonce );
                        $username  = isset( $user_data->user_login ) ? $user_data->user_login : '';
                        $nicename  = isset( $user_data->user_nicename ) ? $user_data->user_nicename : '';
                        $email  = isset( $user_data->user_email ) ? $user_data->user_email : '';
                        $register_date  = isset( $user_data->user_registered ) ? $user_data->user_registered : '';
                        $name  = isset( $user_data->display_name ) ? $user_data->display_name : '';
                        $profile_image = get_user_meta( $user_id, 'wp_classified_user_profile_image_url', true );
                        return array(
                            'user_id'           => $user_id,
                            'username'          => $username,
                            'nicename'          => $nicename,
                            'email'             => $email,
                            'register_date'     => $register_date,
                            'full_name'         => $name,
                            'profile_image'     => $profile_image,
                        );
                        
                    }
                }
            }
        }
        /**
         * global cookies set for user
         */
        public function classified_user_cookie_set( $user_id , $nonce) {
            setCookie( 'wp-classified-user-id', $user_id, time() + 86400, '/' );
        }
        /**
         * get global active user
         */
        public function wp_classified_active_user() {
            $user_ids = isset( $_COOKIE['wp-classified-user-id'] ) ? $_COOKIE['wp-classified-user-id'] : 0;
            if ( $user_ids > 0 ) {
                $user = get_user_by( 'id', $user_ids );
                $user_data = $user->data;
                $user_id   = isset( $user_data->ID ) ? $user_data->ID : 0;
                $username  = isset( $user_data->user_login ) ? $user_data->user_login : '';
                $nicename  = isset( $user_data->user_nicename ) ? $user_data->user_nicename : '';
                $email  = isset( $user_data->user_email ) ? $user_data->user_email : '';
                $register_date  = isset( $user_data->user_registered ) ? $user_data->user_registered : '';
                $name  = isset( $user_data->display_name ) ? $user_data->display_name : '';
                $profile_image = get_user_meta( $user_id, 'wp_classified_user_profile_image_url', true );
                $ads_favoute = get_user_meta( $user_id, 'wp_classified_ads_added_user_favourite', true );
                $all_informatin = array(
                    'user_id'       => $user_id,
                    'username'      => $username,
                    'nicename'      => $nicename,
                    'email'         => $email,
                    'register_date' => $register_date,
                    'full_name'     => $name,
                    'profile_image' => $profile_image ,
                    'favourite_ads' => $ads_favoute ? $ads_favoute : [],   
                );
            } 
            else {
                $user   = wp_get_current_user();
                $user_data = $user->data;
                $user_id   = isset( $user_data->ID ) ? $user_data->ID : 0;
                $username  = isset( $user_data->user_login ) ? $user_data->user_login : '';
                $nicename  = isset( $user_data->user_nicename ) ? $user_data->user_nicename : '';
                $email  = isset( $user_data->user_email ) ? $user_data->user_email : '';
                $register_date  = isset( $user_data->user_registered ) ? $user_data->user_registered : '';
                $name  = isset( $user_data->display_name ) ? $user_data->display_name : '';
                $profile_image = get_user_meta( $user_id, 'wp_classified_user_profile_image_url', true );
                $ads_favoute = get_user_meta( $user_id, 'wp_classified_ads_added_user_favourite', true );
                $all_informatin = array(
                    'user_id'       => $user_id,
                    'username'      => $username,
                    'nicename'      => $nicename,
                    'email'         => $email,
                    'register_date' => $register_date,
                    'full_name'     => $name,
                    'profile_image' => $profile_image,
                    'favourite_ads' => $ads_favoute ? $ads_favoute : [],  
                );
            }
            return $all_informatin;
            
        }
    }
}