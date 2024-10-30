<?php
namespace Wp_Classified_Ads;

class Hook_Apply_Single_Archive_Page {
	public function __construct() {
		add_filter( 'wp_travel_classified_ads_gallery', array( $this, 'wp_classified_ads_single_archive_gallery_hook' ) );
		add_filter( 'wp_travel_classified_ads_single_ads_page', array( $this, 'wp_travel_classified_ads_single_ads_page' ) );
		add_filter( 'wp_travel_classified_ads_content', array( $this, 'wp_travel_classified_ads_content' ) );
		add_filter( 'wp_travel_classified_ads_content_header', array( $this, 'wp_travel_classified_ads_content_header' ) );
		add_filter( 'wp_travel_classified_ads_content_general', array( $this, 'wp_travel_classified_ads_content_general' ) );
		add_filter( 'wp_travel_classified_ads_content_specification', array( $this, 'wp_travel_classified_ads_content_specification' ) );
	}
	public function wp_travel_classified_ads_single_ads_page() {
		global $post;
		$id = get_the_ID();
		?>
		<input type="hidden" value='<?php echo $id; ?>' id='wp-classified-ads-id' >
		<div id="wp-cads-single-ads-page"></div>
		<?php
	}
	public function wp_classified_ads_single_archive_gallery_hook() {
		global $post;
		$id = get_the_ID();
		?>
		<input type="hidden" value='<?php echo $id; ?>' id='wp-classified-ads-gallery-id' >
		<div id='wp-travel-classified-ads-gallery-single-aechive-page'></div>
		<?php
	}
	public function wp_travel_classified_ads_content() {
		global $post;
		$id = get_the_ID();
		?>
		<input type="hidden" value='<?php echo $id; ?>' id='wp-classified-ads-content-id' >
		<div id='wp-travel-classified-ads-content-single-aechive-page'></div>
		<?php
	}
	public function wp_travel_classified_ads_content_header() {
		global $post;
		$id = get_the_ID();
		?>
		<input type="hidden" value='<?php echo $id; ?>' id='wp-classified-ads-content-header-id' >
		<div id='wp-travel-classified-ads-content-header-single-aechive-page'></div>
		<?php
	}
	public function wp_travel_classified_ads_content_general() {
		global $post;
		$id = get_the_ID();
		?>
		<input type="hidden" value='<?php echo $id; ?>' id='wp-classified-ads-content-general-id' >
		<div id='wp-travel-classified-ads-content-general-single-aechive-page'></div>
		<?php
	}
	public function wp_travel_classified_ads_content_specification() {
		global $post;
		$id = get_the_ID();
		?>
		<input type="hidden" value='<?php echo $id; ?>' id='wp-classified-ads-content-specification-id' >
		<div id='wp-travel-classified-ads-content-specification-single-aechive-page'></div>
		<?php
	}

}
new Hook_Apply_Single_Archive_Page();
