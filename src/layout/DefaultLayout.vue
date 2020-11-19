<template>
  <v-app>
    <v-app-bar app dense color="primary" dark>
      <v-toolbar-title>Authority Documents</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn light color="orange"> Save List </v-btn>
    </v-app-bar>
    <v-main>
      <v-container class="main-wrapper">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.main-wrapper {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 0px;
}
</style>
