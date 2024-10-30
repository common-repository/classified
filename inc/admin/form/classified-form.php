<?php

/**
 * Admin Form field for adding classifed ads
 */

/*
*Namespace for form field
*/

namespace Wp_Classified_Ads;

/**
 *  Classified form field list
 *
 * @package classified
 * @category wp-classified-ads
 * @author WenSolution
 *
 * @since 1.0
 */
if (!class_exists('Wp_Classified_Ads_Form_Field')) {

	/**
	 * Create form class
	 */
	class Wp_Classified_Ads_Form_Field
	{
		/**
		 * Use to only text
		 */
		public function product_info_fields()
		{
			$formfield = array(
				array(
					'id'   		=> 1,
					'type'  	=> 'text',
					'name'  	=> 'ads_name',
					'label' 	=> __( 'Product Name', 'classified' ),
					'class' 	=> 'wp-classified-ads-name',
					'required'	=>	true
				),
				array(
					'id'    	=> 2,
					'type'  	=> 'text',
					'name'  	=> 'brand',
					'label' 	=> __( 'Brand', 'classified' ),
					'class' 	=> 'wp-classified-ads-type',
				),
			);
			return apply_filters('wp_classified_ads_text_form_field', $formfield);
		}

		/**
		 * Use to yes/no option with text
		 */
		public function toggle_form_fields()
		{
			$formfield = array(
				array(
					'id'    => 3,
					'type'  => 'radio',
					'name'  => 'is_sale',
					'text'  => 'Yes',
					'label' => __( 'Sale', 'classified' ),
					'class' => 'wp-classified-ads-is-sale',
					'input' => array(
						array(
							'id'    => 4,
							'type'  => 'number',
							'name'  => 'sale_price',
							'label' => __( 'Sale price', 'classified' ),
							'class' => 'wp-classified-ads-sale-price',
						),
					),
				),
				array(
					'id'    => 5,
					'type'  => 'radio',
					'name'  => 'is_delivery',
					'text'  => 'Yes',
					'label' => __( 'Delivery', 'classified' ),
					'class' => 'wp-classified-ads-sale-delivery',
					'input' => array(
						array(
							'id'    => 6,
							'type'  => 'text',
							'name'  => 'delivery_address',
							'text'  => 'Delivery Address',
							'label' => __( 'Delivery Address', 'classified' ),
							'class' => 'wp-classified-ads-sale-delivery-address',
						),
					),
				),
				array(
					'id'    => 7,
					'type'  => 'radio',
					'name'  => 'is_contact',
					'text'  => 'Yes',
					'label' => __( 'Contact', 'classified' ),
					'class' => 'wp-classified-ads-contact-email',
					'input' => array(
						array(
							'id'    => 8,
							'type'  => 'email',
							'name'  => 'contact_email',
							'label' => __( 'Email', 'classified' ),
							'class' => 'wp-classified-ads-contact-email',
							'required'	=> true,
						),
						array(
							'id'    => 9,
							'type'  => 'number',
							'name'  => 'contact_number',
							'label' => __( 'Contact Number', 'classified' ),
							'class' => 'wp-classified-ads-contact-number',
						),
					),
				),
			);
			return apply_filters('wp_classified_ads_toggle_form_field', $formfield);
		}

		public function product_details_fields() {
			$formfield = array(
				array(
					'id'    => 'wp-classified-ads-short-description',
					'type'  => 'textarea',
					'name'  => 'short_description',
					'label'  => __( 'Short product description', 'classified' ),
					'class' => 'wp-classified-ads-short-description',
				),
				array(
					'id'    => 'wp-classified-ads-description',
					'type'  => 'textarea',
					'name'  => 'description',
					'label'  => __( 'Long Product Description', 'classified' ),
					'class' => 'wp-classified-ads-description',
				),
			);
			return apply_filters('wp_classified_ads_product_details_fields', $formfield);
		}

		public function product_extra_info_fields() {
			$formfield = array(
				array(
					'id'    		=> 12,
					'type'  		=> 'text',
					'name'  		=> 'model_no',
					'label'		 	=> __( 'Model Number', 'classified' ),
					'class' 		=> 'wp-classified-ads-model-no',
				),
				array(
					'id'    		=> 13,
					'type'  		=> 'date',
					'name'  		=> 'release_date',
					'label' 		=> __( 'Release Date', 'classified' ),
					'class' 		=> 'wp-classified-ads-make-year',
					'select_future'	=>	false,
				),
			);
			return apply_filters('wp_classified_ads_brand_model_fields', $formfield);
		}

		public function product_attribute_fields() {
			$formfield = array(
				array(
					'id'    => 14,
					'type'  => 'text',
					'name'  => 'color',
					'label' => __( 'Product Color', 'classified' ),
					'class' => 'wp-classified-ads-color',
				),
				array(
					'id'    	=>	'product-condition',
					'type'  	=>	'text',
					'name'  	=>	'condition',
					'label' 	=>	__( 'Condition', 'classified' ),
					'class' 	=>	'wp-classified-ads-color',
					'required'	=>	true
				),
			);
			return apply_filters('wp_classified_ads_attribute_fields', $formfield);
		}

		public function product_additional_fields() {
			$formfield = array(
				array(
					'id'    	=> 15,
					'type'  	=> 'number',
					'name'  	=> 'price',
					'label' 	=> __( 'Price in ($)', 'classified' ),
					'class' 	=> 'wp-classified-ads-price',
					'required'	=>	true,
				),
				array(
					'id'    => 16,
					'type'  => 'number',
					'name'  => 'inventory',
					'label' => __( 'In Stock', 'classified' ),
					'class' => 'wp-classified-ads-sale-quantity',
				),
			);
			return apply_filters('wp_classified_ads_additional_fields', $formfield);
		}

		public function product_location_size() {
			$formfield = array(
				array(
					'id'	=>	'product-size',
					'type'	=>	'text',
					'name'  => 	'size',
					'label' => 	__( 'Size', 'classified' ),
					'class' =>	'wp-classified-ads-size',
				),
				array(
					'id'	=>	'product-dimension',
					'type'	=>	'text',
					'name'  => 	'dimension',
					'label' => 	__( 'Product Dimension', 'classified' ),
					'class' =>	'wp-classified-ads-dimension',
				),
			);
			return apply_filters('wp_classified_ads_location_size', $formfield);
		}

		public function ad_options() {
			$formfield = array(
				array(
					'id'			=>	'ad-location',
					'type'			=>	'text',
					'name'  		=> 	'ad_location',
					'label' 		=> 	__( 'Ad Location', 'classified' ),
					'class' 		=>	'wp-classified-ads-location',
				),
				array(
					'id'			=>	'ad-expiry-date',
					'type'			=>	'date',
					'name'  		=> 	'ad_expiry_date',
					'label' 		=> 	__( 'Ad Expiry Date', 'classified' ),
					'class' 		=>	'wp-classified-ads-expiry-date',
					'select_future'	=>	true,
					'select_time'	=>	true,
					'required'		=>	true,
				),
			);
			return apply_filters('wp_classified_ads_options', $formfield);
		}
	}
}
