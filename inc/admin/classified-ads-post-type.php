<?php
/**
 * Create custom post_type as classified_ads
 */

/*
*Namespace define Menu of classified ads
*/
namespace Wp_Classified_Ads;

use WP_Post_Type;
use WP_Screen;

/**
 *  Create class for creating classified_ads post_type
 *
 * @package wp-classified-ads
 * @category classified-ads
 * @author WenSolution
 *
 * @since 1.0
 */
if ( ! class_exists( 'Wp_Classified_Ads\Classified_Ads_Admin' ) ) {
	class Classified_Ads_Admin {
		/**
		 * Create constructor
		 *
		 * Loadding script and css for backend
		 */
		public function __construct() {
			// add_action( 'admin_enqueue_scripts', array( 'Wp_Classified_Ads\Classified_Ads_Script', 'wp_classified_ads_admin_script' ) );
			add_action( 'current_screen', array( $this, 'script_load_only_classified_ads' ) );
			add_action( 'wp_enqueue_scripts', array( 'Wp_Classified_Ads\Classified_Ads_Script', 'wp_classified_ads_frontend_script' ) );
			add_action( 'init', array( $this, 'wp_classified_ads_post_type' ), 999 );
			add_action( 'init', array( 'Wp_Classified_Ads\Wp_Classifieds_Ads_Templates', 'init' ), 10 );
		}

		/**
		 * backend script load
		 */
		public function script_load_only_classified_ads() {
			$screen = get_current_screen()->post_type;
			if ( is_admin() ) {
				if ( $screen == WP_CLASSIFIED_ADS_POST_TYPE ) {
					add_action( 'admin_enqueue_scripts', array( 'Wp_Classified_Ads\Classified_Ads_Script', 'wp_classified_ads_admin_script' ) );
					remove_post_type_support( WP_CLASSIFIED_ADS_POST_TYPE, 'editor' );
					remove_post_type_support( WP_CLASSIFIED_ADS_POST_TYPE, 'title' );
					remove_meta_box( 'submitdiv', WP_CLASSIFIED_ADS_POST_TYPE, 'normal' );
					remove_meta_box( WP_CLASSIFIED_ADS_ADS_TEXONOMY . 'div', WP_CLASSIFIED_ADS_POST_TYPE, 'normal' );
					add_filter(
						'manage_' . WP_CLASSIFIED_ADS_POST_TYPE . '_posts_columns',
						function ( $columns ) {
							$columns['image']     = 'Image';
							$columns['ads_type']  = 'Ad Category';
							$columns['inventory'] = 'Stock Inventory';
							return apply_filters( 'wp_classified_ads_backend_table_header', $columns );
						}
					);
					add_action(
						'manage_' . WP_CLASSIFIED_ADS_POST_TYPE . '_posts_custom_column',
						function ( $column_id, $post_id ) {
							switch ( $column_id ) {
								case 'image':
									echo '<img src="' . get_the_post_thumbnail_url( $post_id ) . '" alt="image" height="50" width="50">';
									break;
								case 'ads_type':
									$terms = get_the_terms( $post_id, WP_CLASSIFIED_ADS_ADS_TEXONOMY );
									if ( isset( $terms[0] ) ) {
										print_r( $terms[0]->name );
									}
									break;
								case 'inventory':
									echo get_post_meta( $post_id, 'wp_classified_ads_stock_inventory', true );
									break;
							}
						},
						10,
						2
					);

				}
			}
		}

		/**
		 * fuction for register custom post type
		 */

		public function wp_classified_ads_post_type() {
			if ( ! function_exists( 'is_plugin_active' ) ) {
				require_once ABSPATH . '/wp-admin/includes/plugin.php';
			}
			$menu_label = array(
				'menu_name'      => _x( 'WP Classified', 'Admin Menu text', 'classified' ),
				'name'           => _x( 'WP Classified', 'Post type general name', 'classified' ),
				'singular_name'  => _x( 'WP Classified', 'Post type singular name', 'classified' ),
				'name_admin_bar' => _x( 'WP Classified', 'Add New on Toolbar', 'classified' ),
				'all_items'      => __( 'All Ads', 'classified' ),
				'add_new'        => __( 'Create Ad', 'classified' ),
				'edit_item'      => __( 'Edit Ad', 'classified' ),
			);
			$args       = array(
				'show_in_menu'      => true,
				'labels'            => $menu_label,
				'public'            => true,
				'show_ui'           => true,
				'show_in_admin_bar' => true,
				'menu_position'     => 2,
				'has_archive'       => true,
				'description'        => __( 'Description.', 'classified' ),
				'publicly_queryable' => true,
				'show_in_menu'       => true,
				'query_var'          => true,
				'rewrite'            => array(
					'slug'       => WP_CLASSIFIED_ADS_POST_TYPE,
					'with_front' => true,
				),
				'capability_type'    => 'post',
				'hierarchical'       => false,
				'show_in_rest'       => true,
			);
			register_post_type( WP_CLASSIFIED_ADS_POST_TYPE, $args );
			$texonomy_registers = array(
				'label'        => __( 'Ad Category', 'classified' ),
				'hierarchical' => true,
				'public'       => true,
			);
			register_taxonomy( WP_CLASSIFIED_ADS_ADS_TEXONOMY, WP_CLASSIFIED_ADS_POST_TYPE, $texonomy_registers );
			// remove_meta_box( WP_CLASSIFIED_ADS_ADS_TEXONOMY, WP_CLASSIFIED_ADS_POST_TYPE, 'normal' );
			$flussing = get_option( 'wp_classified_flush_permalink' );
			if ( $flussing == false ) {
				flush_rewrite_rules( true );
				update_option( 'wp_classified_flush_permalink', true );
			}
		}
	}
}

/*
 * Create instance of class Classified_Ads_Admin
 */
new Classified_Ads_Admin();


