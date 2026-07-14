<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Service;
use App\Models\Setting;
use App\Models\HeroContent;
use App\Models\SocialLink;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Secure Admin Credentials with Roles
        
        // Super Admin (Manage everything)
        User::updateOrCreate(
            ['email' => 'adsparktechnologies01@gmail.com'],
            [
                'name' => 'Dhruv Marathe',
                'password' => Hash::make('AdSpark@2026'),
                'role' => 'Super Admin',
                'status' => 'active',
            ]
        );

        // Admin (Can manage CMS, except admin accounts editing/creation)
        User::updateOrCreate(
            ['email' => 'admin@adsparktech.com'],
            [
                'name' => 'John Admin',
                'password' => Hash::make('Password@2026'),
                'role' => 'Admin',
                'status' => 'active',
            ]
        );

        // Editor (Can edit CMS content, but not settings or admins)
        User::updateOrCreate(
            ['email' => 'editor@adsparktech.com'],
            [
                'name' => 'Sarah Editor',
                'password' => Hash::make('Password@2026'),
                'role' => 'Editor',
                'status' => 'active',
            ]
        );

        // Manager (Can view metrics and manage inquiries)
        User::updateOrCreate(
            ['email' => 'manager@adsparktech.com'],
            [
                'name' => 'Alex Manager',
                'password' => Hash::make('Password@2026'),
                'role' => 'Manager',
                'status' => 'active',
            ]
        );

        // 2. Seed Hero Content
        HeroContent::updateOrCreate(
            ['id' => 1],
            [
                'title' => 'Engineering Custom Software & Systems Automation',
                'subtitle' => 'Our specialized squads design high-throughput custom software, cloud clusters, and digital workflows for leading enterprises.',
                'cta_text' => 'Book A Consultation',
                'cta_link' => '#contact'
            ]
        );

        // 3. Seed Website Settings
        $settings = [
            'company_name' => 'AdSpark Technologies',
            'logo_text' => 'AdSpark',
            'contact_email' => 'adsparktechnologies01@gmail.com',
            'contact_phone' => '+1 (555) 019-2831',
            'address' => '100 Silicon Way, Suite 400, San Francisco, CA',
            'meta_title' => 'AdSpark Technologies | Enterprise Systems & Custom Software Solutions',
            'meta_description' => 'AdSpark Technologies provides robust enterprise cloud clusters, AI workflow engines, and highly secure custom systems architecture for global corporations.',
            'meta_keywords' => 'custom software, systems integration, enterprise automation, cloud architecture, AI consulting',
            'website_status' => 'online', // online, offline
            'footer_text' => '© 2026 AdSpark Technologies. All rights reserved. Enterprise-grade modern systems engineering.'
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        // 4. Seed Social Links
        $socials = [
            ['platform' => 'LinkedIn', 'url' => 'https://linkedin.com/company/adspark-technologies', 'icon' => 'Linkedin'],
            ['platform' => 'GitHub', 'url' => 'https://github.com/adspark-technologies', 'icon' => 'Github'],
            ['platform' => 'Twitter', 'url' => 'https://twitter.com/adspark_tech', 'icon' => 'Twitter'],
        ];

        foreach ($socials as $s) {
            SocialLink::updateOrCreate(['platform' => $s['platform']], $s);
        }

        // 5. Seed Services Catalog
        $services = [
            [
                'title' => 'Custom Software Engineering',
                'icon' => 'Cpu',
                'category' => 'Software Engineering',
                'short_desc' => 'High-throughput enterprise engines, custom APIs, and backend architectures designed to scale infinitely.',
                'description' => 'We design scalable microservice layers, structured memory states, and low-latency API routers to handle extreme concurrency loads. Standardized automated testing frameworks ensure 100% architectural integrity.'
            ],
            [
                'title' => 'Web App Development',
                'icon' => 'MonitorPlay',
                'category' => 'Web Development',
                'short_desc' => 'Visually stunning, accessible, and fast web portals optimized for maximum user experience.',
                'description' => 'Our frontend engineering teams build highly interactive, type-safe single page applications using modern state lifecycles and robust CSS architectures.'
            ],
            [
                'title' => 'Cloud Infrastructure & DevOps',
                'icon' => 'Cloud',
                'category' => 'Cloud Infrastructure',
                'short_desc' => 'Resilient container deployment clusters, auto-scaling load balancing, and reliable automated CI/CD pipelines.',
                'description' => 'We deploy securely isolated VPC configurations, Terraform cluster provisioning, and automated continuous delivery pipelines to ensure zero-downtime service upgrades.'
            ],
            [
                'title' => 'Cognitive AI Automation',
                'icon' => 'Brain',
                'category' => 'AI Engineering',
                'short_desc' => 'Integration of LLMs, vector search layers, and predictive models into custom enterprise software.',
                'description' => 'Deploy custom vector document indexing pipelines, system prompts validation, and intelligent model gateways to automate highly repetitive enterprise workflows.'
            ]
        ];

        foreach ($services as $svc) {
            Service::updateOrCreate(['title' => $svc['title']], $svc);
        }
    }
}
