package com.ikid

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    @Suppress("UNCHECKED_CAST")
    getDefaultReactHost(
      context = applicationContext,
      packageList = PackageList(this).packages,
      jsMainModulePath = "index.js",
      isHermesEnabled = true,
      useDevSupport = true
    )
  }

  // Legacy ReactNativeHost for compatibility
  @Deprecated("Use reactHost instead", ReplaceWith("reactHost"))
  override val reactNativeHost: ReactNativeHost
    get() = throw UnsupportedOperationException("Use reactHost instead")

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
