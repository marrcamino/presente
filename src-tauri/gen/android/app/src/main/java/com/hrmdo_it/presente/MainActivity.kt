package com.hrmdo_it.presente

import android.content.res.Configuration
import android.graphics.Color
import android.os.Bundle
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat

class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    val isDarkMode = (resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES

    WindowCompat.setDecorFitsSystemWindows(window, false)
    window.statusBarColor = if (isDarkMode) Color.parseColor("#141414") else Color.parseColor("#FFFFFF")

    val insetsController = WindowInsetsControllerCompat(window, window.decorView)
    insetsController.isAppearanceLightStatusBars = !isDarkMode
  }
}