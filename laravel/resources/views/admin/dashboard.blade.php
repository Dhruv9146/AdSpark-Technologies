@extends('layouts.admin')

@section('admin_title', 'Analytics & Enquiries Dashboard')

@section('content')

<!-- STATS ROW -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
        <div class="space-y-1">
            <span class="text-xs text-slate-500 block font-semibold">Total Inquiries</span>
            <span class="text-2xl font-display font-bold text-slate-900 block">{{ $totalEnquiries }}</span>
            <span class="text-[10px] text-slate-400 block">From public contact forms</span>
        </div>
        <div class="p-3 bg-blue-50 border border-blue-100 rounded-xl text-brand-blue">
            <i data-lucide="mail-open" class="w-5 h-5"></i>
        </div>
    </div>

    <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
        <div class="space-y-1">
            <span class="text-xs text-slate-500 block font-semibold">Dynamic Services</span>
            <span class="text-2xl font-display font-bold text-slate-900 block">{{ $totalServices }}</span>
            <span class="text-[10px] text-slate-400 block">Active dynamic slots</span>
        </div>
        <div class="p-3 bg-blue-50 border border-blue-100 rounded-xl text-brand-blue">
            <i data-lucide="cpu" class="w-5 h-5"></i>
        </div>
    </div>

    <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
        <div class="space-y-1">
            <span class="text-xs text-slate-500 block font-semibold">Platform Status</span>
            <span class="text-2xl font-display font-bold text-green-600 block">Online</span>
            <span class="text-[10px] text-slate-400 block">Laravel 12 Active</span>
        </div>
        <div class="p-3 bg-green-50 border border-green-100 rounded-xl text-green-600">
            <i data-lucide="shield-check" class="w-5 h-5"></i>
        </div>
    </div>
</div>

<!-- ENQUIRIES LIST -->
<div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
    <div class="flex justify-between items-center border-b pb-3 border-slate-100">
        <div>
            <h3 class="font-display font-bold text-base text-slate-900">Inquiries Mailbox</h3>
            <span class="text-xs text-slate-500 block font-normal">All dynamic submissions saved securely inside MySQL</span>
        </div>
    </div>

    @if(session('success'))
        <div class="p-3 bg-green-100 border border-green-200 text-green-700 rounded-xl text-xs font-bold">
            {{ session('success') }}
        </div>
    @endif

    <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-600">
            <thead class="bg-slate-50 text-slate-500 uppercase tracking-widest text-[9px] border-b border-slate-200">
                <tr>
                    <th class="p-4 font-bold">Sender Name</th>
                    <th class="p-4 font-bold">Subject Matter</th>
                    <th class="p-4 font-bold">Message details</th>
                    <th class="p-4 font-bold">Status</th>
                    <th class="p-4 font-bold text-right">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @forelse($enquiries as $enq)
                    <tr class="hover:bg-slate-50/50">
                        <td class="p-4">
                            <span class="font-bold text-slate-900 block">{{ $enq->name }}</span>
                            <span class="text-slate-400 font-normal text-[10px] block mt-0.5">{{ $enq->email }}</span>
                        </td>
                        <td class="p-4 font-semibold text-slate-800">{{ $enq->subject }}</td>
                        <td class="p-4 text-slate-500 max-w-sm font-normal leading-relaxed">{{ $enq->message }}</td>
                        <td class="p-4">
                            <span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase {{ $enq->status === 'Read' ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-brand-blue border border-blue-100' }}">
                                {{ $enq->status }}
                            </span>
                        </td>
                        <td class="p-4 text-right flex gap-2 justify-end items-center">
                            @if($enq->status !== 'Read')
                                <form action="{{ route('admin.enquiries.status', $enq->id) }}" method="POST">
                                    @csrf
                                    <input type="hidden" name="status" value="Read">
                                    <button type="submit" class="p-1.5 bg-slate-100 hover:bg-brand-blue text-slate-600 hover:text-white rounded-lg transition-all" title="Mark as Read">
                                        <i data-lucide="check" class="w-3.5 h-3.5"></i>
                                    </button>
                                </form>
                            @endif

                            <form action="{{ route('admin.enquiries.delete', $enq->id) }}" method="POST" onsubmit="return confirm('Confirm deletion of this enquiry?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="p-1.5 bg-slate-100 hover:bg-red-600 text-slate-600 hover:text-white rounded-lg transition-all" title="Delete Inquiry">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                </button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="p-8 text-center text-slate-400 italic font-normal">
                            No inquiries submitted yet.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

@endsection
