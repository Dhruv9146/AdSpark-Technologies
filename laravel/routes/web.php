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
    
    // 1. Core Dashboard Stats
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // 2. Personal Profile Management (Any role)
    Route::get('/profile', [AdminController::class, 'showProfile'])->name('admin.profile');
    Route::post('/profile/update', [AdminController::class, 'updateProfile'])->name('admin.profile.update');
    Route::post('/profile/password', [AdminController::class, 'changePassword'])->name('admin.profile.password');
    Route::post('/profile/photo', [AdminController::class, 'uploadProfilePhoto'])->name('admin.profile.photo');

    // 3. Super Admin Only: Admin Accounts CRUD
    Route::get('/admins', [AdminController::class, 'listAdmins'])->name('admin.admins.list');
    Route::post('/admins/create', [AdminController::class, 'createAdmin'])->name('admin.admins.create');
    Route::post('/admins/{id}/update', [AdminController::class, 'updateAdmin'])->name('admin.admins.update');
    Route::post('/admins/{id}/toggle', [AdminController::class, 'toggleAdminStatus'])->name('admin.admins.toggle');
    Route::post('/admins/{id}/reset-password', [AdminController::class, 'resetAdminPassword'])->name('admin.admins.reset-password');
    Route::delete('/admins/{id}', [AdminController::class, 'deleteAdmin'])->name('admin.admins.delete');

    // 4. Contact Enquiries (Inbox Control)
    Route::get('/enquiries', [AdminController::class, 'manageEnquiries'])->name('admin.enquiries');
    Route::post('/enquiries/{id}/status', [AdminController::class, 'updateEnquiryStatus'])->name('admin.enquiries.status');
    Route::post('/enquiries/{id}/reply', [AdminController::class, 'replyEnquiry'])->name('admin.enquiries.reply');
    Route::delete('/enquiries/{id}', [AdminController::class, 'deleteEnquiry'])->name('admin.enquiries.delete');
    Route::get('/enquiries/export-csv', [AdminController::class, 'exportEnquiriesCSV'])->name('admin.enquiries.export');

    // 5. Manage Home Page / Hero Content
    Route::get('/home', [AdminController::class, 'manageHome'])->name('admin.home');
    Route::post('/home/update', [AdminController::class, 'updateHome'])->name('admin.home.update');

    // 6. Manage Services (CRUD)
    Route::get('/services', [AdminController::class, 'manageServices'])->name('admin.services');
    Route::post('/services/create', [AdminController::class, 'createService'])->name('admin.services.create');
    Route::post('/services/{id}/update', [AdminController::class, 'updateService'])->name('admin.services.update');
    Route::delete('/services/{id}', [AdminController::class, 'deleteService'])->name('admin.services.delete');

    // 7. Manage Contact Coordinates & Social links
    Route::get('/contact', [AdminController::class, 'manageContact'])->name('admin.contact');
    Route::post('/contact/update', [AdminController::class, 'updateContactInfo'])->name('admin.contact.update');
    Route::post('/social/create', [AdminController::class, 'createSocialLink'])->name('admin.social.create');
    Route::delete('/social/{id}', [AdminController::class, 'deleteSocialLink'])->name('admin.social.delete');

    // 8. Website Settings & SEO Tags (Super Admin only checks inside controller)
    Route::get('/settings', [AdminController::class, 'manageSettings'])->name('admin.settings');
    Route::post('/settings/update', [AdminController::class, 'updateSettings'])->name('admin.settings.update');
});
