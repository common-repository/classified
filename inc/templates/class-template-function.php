<?php
namespace Wp_Classified_Ads;

class Wp_Classifieds_Ads_Templates {
	public static function init() {
		add_filter( 'template_include', array( __CLASS__, 'wp_classified_ads_templates_include' ) );
	}
	public static function wp_classified_ads_templates_include( $template ) {

		if ( is_post_type_archive( WP_CLASSIFIED_ADS_POST_TYPE ) ) {
			$ads_templates = self::wp_classified_ads_return_templates( 'classified-ads-archive.php' );
			if ( $ads_templates ) {
				return $ads_templates;
			}
		} elseif ( is_singular( WP_CLASSIFIED_ADS_POST_TYPE ) ) {
			$ads_single_template = self::wp_classified_ads_return_templates( 'classified-ads-single-archive.php' );
			return $ads_single_template;
		}
		return $template;
	}
	public static function wp_classified_ads_return_templates( $templates_name ) {
		$path     = 'classified-ads/';
		$template = locate_template(
			array(
				trailingslashit( $path ) . $templates_name,
				$templates_name,
			)
		);
		if ( $template ) {
			return $template;
		}
		return WP_CLASSIFIED_ADS_ABSPATH . '/inc/templates/' . $templates_name;
	}
}
