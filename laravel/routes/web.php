<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Public Frontend routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/services/{id}', [HomeController::class, 'serviceDetails'])->name('service.details');
Route::get('/contact', [HomeController::class, 'contact'])->name('contact');
Route::post('/contact/submit', [ContactController::class, 'submit'])->name('contact.submit');

// Admin Authentication routes
Route::get('/admin/login', [AdminController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'login'])->name('admin.login.submit');
Route::post('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');

// Secure Admin Dashboard & CMS Module routes
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    
    // Manage Enquiries (Inbox)
    Route::post('/enquiries/{id}/status', [AdminController::class, 'updateEnquiryStatus'])->name('admin.enquiries.status');
    Route::delete('/enquiries/{id}', [AdminController::class, 'deleteEnquiry'])->name('admin.enquiries.delete');

    // Manage Home Content / Hero Slides
    Route::get('/home', [AdminController::class, 'manageHome'])->name('admin.home');
    Route::post('/home/update', [AdminController::class, 'updateHome'])->name('admin.home.update');

    // Manage Services (CRUD)
    Route::get('/services', [AdminController::class, 'manageServices'])->name('admin.services');
    Route::post('/services/create', [AdminController::class, 'createService'])->name('admin.services.create');
    Route::post('/services/{id}/update', [AdminController::class, 'updateService'])->name('admin.services.update');
    Route::delete('/services/{id}', [AdminController::class, 'deleteService'])->name('admin.services.delete');

    // Manage Contact Coordinates & Social links
    Route::get('/contact', [AdminController::class, 'manageContact'])->name('admin.contact');
    Route::post('/contact/update', [AdminController::class, 'updateContactInfo'])->name('admin.contact.update');
    Route::post('/social/create', [AdminController::class, 'createSocialLink'])->name('admin.social.create');
    Route::delete('/social/{id}', [AdminController::class, 'deleteSocialLink'])->name('admin.social.delete');

    // Website settings & SEO Tags configuration
    Route::get('/settings', [AdminController::class, 'manageSettings'])->name('admin.settings');
    Route::post('/settings/update', [AdminController::class, 'updateSettings'])->name('admin.settings.update');

    // Change Admin Credentials
    Route::post('/password/update', [AdminController::class, 'updatePassword'])->name('admin.password.update');

    // Upload & Delete Files System
    Route::get('/files', [AdminController::class, 'manageFiles'])->name('admin.files');
    Route::post('/files/upload', [AdminController::class, 'uploadFile'])->name('admin.files.upload');
    Route::post('/files/delete', [AdminController::class, 'deleteFile'])->name('admin.files.delete');
});
