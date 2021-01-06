# Sage 9 Starter

This is a very opinionated and highly customised starter for developing WordPress themes with Sage 9.

Features

- tailwindcss (v2)
- Webpack v5
- Alpinejs + spruce
- Babel (instead of Buble) for scripts

Modifications

- Stylelint removed.
- Bootstrapnavwalker added
- Removed support for theme images & fonts
- ESLint relaxed

Default inclusions

- Woocommerce support
- Accessible Mobile navigation menu with AlpineJS
- Theme settings page (ACF)
- Custom (gutenberg) blocks (ACF)
- Store notice (coming)

## Get started

### 1. Clone this repo to your working directory.

Example (if working only on theme files)

```bash
$ cd ~/Projects/
```

Or if working in a WordPress root dir

```bash
$ cd ~/Projects/<client-name>/wp-content/themes/
```

Then

```bash
$ git clone https://github.com/kingsdesigntas/roots-sage-starter.git <new-theme-name>
```

### 2. CD into your theme directory

```bash
$ cd ~/Projects/<new-theme-name>
# OR
$ cd ~/Projects/<client-name>/wp-content/themes/<new-theme-name>
```

### 3. Edit setup.js

Find `setup.js` in your theme folder root. Open it up and edit the config object

```js
const config = {
  //
  // ...
  // YOUR CONFIG
  // ...
  //
};
```

### 4. Install js/dev dependencies & run setup.js

Run

```bash
$ yarn && yarn setup
```

Or (if not using yarn)

```bash
$ npm install && npm run setup
```

### 5. Install composer dependencies

If developing using a remote server (which is the case most of the time), you'll need to get the project's PHP dependencies onto the server.

You have two options.

#### **Option 1:** SSH & run remotely

The first option is to SSH into the server using your dev accounts credentials (if using VSCode, simply go to the SFTP Explorer, right click the root folder and click "Open SSH in terminal").

Then CD into your project's folder on the remote server (note, if you haven't uploaded anything yet, you may need to create the folder on the server, make sure it matches your config settings from step 3 - wp-content/themes/<theme-name>)

```bash
$ cd /sites/<dev-subdomain>.kingsdesign.info/files/wp-content/themes/<theme-name>
$ composer install
```

#### **Option 2:** Install locally & upload

Alternatively, you can run composer install in your local instance & upload the files

You will need composer installed on your machine for this.

```bash
$ cd ~/Projects/<theme-name> # or Projects/<client>/wp-content/themes/<theme-name>
$ composer install
```

You should now have a `vendor` directory in your theme folder (under root, `<theme-name>/vendor`)

Upload this folder (& contents) to the corresponding location on the server (`/sites/<dev-subdomain>.kingsdesign.info/files/wp-content/themes/<theme-name>/vendor`)

## Helpful Hints

### Use a helper method (app/helpers.php) in a controller

Declare the method in helpers.php

```php
function my_helper() {
  ...
}
```

Then in the controller call

```php
\App\my_helper()
```

Or in a template (.blade.php file)

```blade
{{ App\my_helper() }}
```
