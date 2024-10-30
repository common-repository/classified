<?php
/**
 * Admin text localize
 */

/*
*Namespace define localize text
*/
namespace Wp_Classified_Ads;

/**
 *  Create class forlocalize text
 *
 * @package wp-classified-ads
 * @category classified-ads
 * @author WenSolution
 *
 * @since 1.0
 */
if ( ! class_exists( 'Classified_Ads_Admin_String' ) ) {

	class Classified_Ads_Admin_String {

		public static function get_string() {
			$site_url  = get_site_url();
			$formfield = new Wp_Classified_Ads_Form_Field();
			$user_obj  = new WP_Classified_User_Helper();
			$user_data = $user_obj->wp_classified_active_user();
			$page_id   = get_option( 'wp_classified_user_dashboard_page_id' );
			$strings   = array(
				'site_url'                  => site_url(),
				'home_url'                  => home_url( '/wp-admin/admin.php?page=new-ads-details' ),
				'site_title'                => wp_get_document_title(),
				'content'                   => apply_filters( 'wp_classified_ads_sigle_content', 'left' ),
				'classified_version'        => WP_CLASSIFIED_ADS_VERSION,
				'product_info_fields'       => $formfield->product_info_fields(),
				'product_details_fields'    => $formfield->product_details_fields(),
				'product_extra_info_fields' => $formfield->product_extra_info_fields(),
				'product_attribute_fields'  => $formfield->product_attribute_fields(),
				'product_location_size'     => $formfield->product_location_size(),
				'product_additional_fields' => $formfield->product_additional_fields(),
				'ad_options'                => $formfield->ad_options(),
				'toggle_form_fields'        => $formfield->toggle_form_fields(),
				'_nonce'                    => wp_create_nonce( 'wp_classified_ads' ),
				'is_admin'                  => is_admin(),
				'current_user'              => wp_get_current_user(),
				'user_dashboard'            => is_page( $page_id ),
				'user_dashboard_page_id'    => $page_id,
				'login_user_details'        => $user_data,
				'user_nonce'                => wp_create_nonce( 'wp_rest' ),
				'ABS_PLUGIN_PATH'           => untrailingslashit( plugin_dir_url( WP_CLASSIFIED_ADS_PLUGIN_FILE ) ),
			);
			return apply_filters( 'wp_travel_classified_ads_string', $strings );
		}

	}
}
