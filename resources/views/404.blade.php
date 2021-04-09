@extends('layouts.app')

@section('content')
  @include('partials.page-header')

  @if (!have_posts())
   <div class="container ">
      <div class="alert alert-warning font-bold">
        <h3> {{ __('Sorry, but the page you were trying to view does not exist.', 'sage') }} </h3>
      </div>
    </div>
  @endif
@endsection
