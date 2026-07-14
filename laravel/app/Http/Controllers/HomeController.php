<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Setting;
use App\Models\HeroContent;
use App\Models\SocialLink;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $hero = HeroContent::first() ?? new HeroContent([
            'title' => 'Engineering Custom Software & Systems Automation',
            'subtitle' => 'Our specialized squads design high-throughput custom software, cloud clusters, and digital workflows.'
        ]);

        $services = Service::all();
        $socials = SocialLink::all();
        
        // Load settings key-values
        $settings = Setting::pluck('value', 'key')->all();

        return view('home', compact('hero', 'services', 'socials', 'settings'));
    }

    public function serviceDetails($id)
    {
        $service = Service::findOrFail($id);
        $socials = SocialLink::all();
        $settings = Setting::pluck('value', 'key')->all();

        return view('service-details', compact('service', 'socials', 'settings'));
    }

    public function about()
    {
        $socials = SocialLink::all();
        $settings = Setting::pluck('value', 'key')->all();

        return view('about', compact('socials', 'settings'));
    }

    public function contact()
    {
        $socials = SocialLink::all();
        $settings = Setting::pluck('value', 'key')->all();

        return view('contact', compact('socials', 'settings'));
    }
}
