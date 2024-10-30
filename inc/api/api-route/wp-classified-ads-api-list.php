<?php
/**
 *
 * Create list of custom end point for api
 * Wp Travel Classified Ads Plugins
 */
namespace Wp_Classified_Ads;

use WP_REST_Server;
/**
 * @since 1.0
 */
class Wp_Classified_Ads_Api_Lists {
	/**
	 * @return api callback function and route 
	 */
	public static function wp_all_classified_ads_api() {
		$register = array(
			/**
			 * For get all clssified ads
			 */
			array(
				'api_version'       => 'wp/' . WP_CLASSIFIED_ADS_API_VERSION ,
				'route'             => 'wp-classified-ads',
				'method'            => WP_REST_Server::READABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Classified_All_Ads_Get', 'wp_get_classified_ads_api' ),
			),
			/**
			 * For get single clssified ads
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/(?P<id>[\d]+)',
				'method'            => WP_REST_Server::READABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Travel_Classified_Ads_Single_Ads_Get', 'wp_travel_get_single_classified_ads_api' ),
			),
			/**
			 * For post a classified ads
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads',
				'method'            => WP_REST_Server::CREATABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Travel_Classified_Ads_Create', 'wp_travel_post_clssified_ads_api' ),
			),
			/**
			 * For update classified ads
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/(?P<id>[\d]+)',
				'method'            => WP_REST_Server::EDITABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Travel_Classified_Single_Ads_Edit', 'wp_travel_update_clssified_ads_api' ),
			),
			/**
			 * For delete classified ads
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/(?P<id>[\d]+)',
				'method'            => WP_REST_Server::DELETABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Travel_Classified_Ads_Delete', 'wp_travel_delete_clssified_ads_api' ),
			),
			/**
			 * 
			 * create api for classified ads type
			 *
			 * For get all clssified ads type
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/type',
				'method'            => WP_REST_Server::READABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Classified_All_Ads_Get', 'wp_travel_get_classified_ads_type_api' ),
			),
			/**
			 * For get single clssified ads type
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/type/(?P<id>[\d]+)',
				'method'            => WP_REST_Server::READABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Travel_Classified_Ads_Single_Ads_Get', 'wp_travel_get_single_classified_ads_type_api' ),
			),
			/**
			 * For create a classified ads type
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/type',
				'method'            => WP_REST_Server::CREATABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Travel_Classified_Ads_Create', 'wp_travel_post_clssified_ads_type_api' ),
			),
			/**
			 * For update classified ads type
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/type/(?P<id>[\d]+)',
				'method'            => WP_REST_Server::EDITABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Travel_Classified_Single_Ads_Edit', 'wp_travel_update_clssified_ads_type_api' ),
			),
			/**
			 * For delete classified ads type
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/type/(?P<id>[\d]+)',
				'method'            => WP_REST_Server::DELETABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Travel_Classified_Ads_Delete', 'wp_travel_delete_clssified_ads_type_api' ),
			),
			/**
			 * For create user
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/user',
				'method'            => WP_REST_Server::CREATABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Classified_Ads_User_Create', 'wp_classified_ads_create_user' ),
			),
			/**
			 * For update user
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/user/(?P<id>[\d]+)',
				'method'            => WP_REST_Server::EDITABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Classified_Ads_Update_User', 'wp_classified_ads_update_user' ),
			),
			/**
			 * For get active user
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/user',
				'method'            => WP_REST_Server::READABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Classified_Ads_User_Get', 'wp_classified_ads_get_user' ),
			),
			/**
			 * For login user
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/user/login',
				'method'            => WP_REST_Server::CREATABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Classified_Ads_User_LoginUser', 'wp_classified_ads_login_user' ),
			),
			/**
			 * For logout user
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/user/logout',
				'method'            => WP_REST_Server::CREATABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Classified_Ads_User_LogOut', 'wp_classified_ads_logout_user' ),
			),
			/**
			 * remove gallery image while edit post on frontend
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/gallery',
				'method'            => WP_REST_Server::DELETABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Classified_Ads_Image', 'wp_classified_ads_image_delete' ),
			),
			/**
			 * added ads user favourite
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/user-ads-favourite',
				'method'            => WP_REST_Server::CREATABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Classified_Add_Ads_Favourite', 'wp_classified_ads_add_favourite' ),
			),
			/**
			 * for add comment and ratting
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/rattings',
				'method'            => WP_REST_Server::CREATABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Classified_Ads_Comment_Ratting', 'wp_classified_ads_comment_rattings' ),
			),
			/**
			 * use of forgot/reset password
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/reset-password',
				'method'            => WP_REST_Server::CREATABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Classified_Ads_Reset_Password', 'wp_classified_ads_reset_password' ),
			),
			/**
			 * Ads inquiry
			 */
			array(
				'api_version'       => 'wp/' .  WP_CLASSIFIED_ADS_API_VERSION,
				'route'             => 'wp-classified-ads/inquiry',
				'method'            => WP_REST_Server::CREATABLE,
				'callback_function' => array( 'Wp_Classified_Ads\Wp_Classified_Ads_Inquiry', 'wp_classified_ads_inquiry' ),
			),
		);
		return apply_filters( 'wp_classified_ads_register_route', $register );
	}
}