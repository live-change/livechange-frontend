<template>
  <pre data-headers>{{ JSON.stringify(metadata, null, '  ') }}</pre>
  <div data-html class="message m-6">
    <p class="text-lg">
      Hello username!
    </p>
    <p>
      We are glad to see you have just signed up for DEMO with your email.
      In order to confirm that, please click the button below:
    </p>
    <div>
      <Button label="Confirm email" class="p-button-lg" />
    </div>
    <p>
      Or copy this address to your browser address bar:<br>
      <a :href="linkAddress">
        {{ linkAddress }}
      </a>
    </p>
    <p>
      Let us know in case it's not you.
    </p>
    <p>
      See you soon<br>
      Live Change Team
    </p>
    <img src="/images/logo128.png">
  </div>
  <pre class="message" data-text>
    Hello username!

    We are glad to see you have just signed up for DEMO with your email.
    In order to confirm that, please click link below or copy address to your browser address bar:

    {{ linkAddress }}

    Let us know in case it's not you.

    See you soon
    Live Change Team
  </pre>
</template>

<script setup>
  import Button from "primevue/button"

  const { action, contact, data } = defineProps({
    action: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    },
    data: {
      type: String,
      required: true
    }
  })

  const metadata = {
    from: 'admin@flipchart.live',
    subject: 'Confirm your email address.',
    to: contact
  }

  const linkAddress = 'https://example.com/link/key'

</script>

<style scoped>
  img {
    width: 100%;
    max-width: 100px;
  }
  .message {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
    color: #495057;
    font-weight: 400;
  }
  pre {
    border-top: 1px solid black;
    border-bottom: 1px solid black;
  }
</style>