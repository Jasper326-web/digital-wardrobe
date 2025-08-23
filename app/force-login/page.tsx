"use client"

import { LoginForm } from "@/components/login-form"
import { Navigation } from "@/components/navigation"

export default function ForceLoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation onProtectedLinkClick={() => {}} />
      {/* Background images */}
      <div className="absolute inset-0 opacity-90">
        <img
          src="/Lucid_Origin_A_stylish_digital_wardrobe_concept_scene_showcasi_2.jpg"
          alt="Stylish digital wardrobe concept scene"
          className="w-full h-full object-cover object-center"
        />
        {/* Very light gray overlay */}
        <div className="absolute inset-0 bg-gray-100/20"></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex items-center py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left side - Promotional content */}
            <div className="text-white space-y-8 lg:space-y-12">
              <div className="space-y-6 lg:space-y-8">
                <div className="relative">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight">
                    <span className="inline-flex items-center gap-2 lg:gap-3 whitespace-nowrap">
                      <span className="text-4xl sm:text-5xl lg:text-6xl animate-pulse">🔥</span>
                      <span
                        className="text-white font-black whitespace-nowrap"
                        style={{ 
                          textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
                        }}
                      >
                        Know your daily outfit cost
                      </span>
                    </span>
                  </h1>
                </div>

                <div className="space-y-4 lg:space-y-6 text-base sm:text-lg lg:text-xl">
                  <div className="group flex items-start gap-3 lg:gap-4 p-0">
                    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">📸</span>
                    <p className="leading-tight">
                      <span 
                        className="underline decoration-white decoration-2 underline-offset-4 font-black text-white"
                        style={{ 
                          textShadow: "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000"
                        }}
                      >
                        Upload your wardrobe
                      </span>
                      <span 
                        className="mx-2 font-black text-white"
                        style={{ 
                          textShadow: "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000"
                        }}
                      >
                        →
                      </span>
                      <span 
                        className="font-black text-white"
                        style={{ 
                          textShadow: "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000"
                        }}
                      >
                        Build your personal closet
                      </span>
                    </p>
                  </div>

                  <div className="group flex items-start gap-3 lg:gap-4 p-0">
                    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">📊</span>
                    <p className="leading-tight text-white">
                      <span 
                        className="font-black text-white whitespace-nowrap"
                        style={{ 
                          textShadow: "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000"
                        }}
                      >
                        Track cost-per-wear so you know what's worth keeping
                      </span>
                    </p>
                  </div>

                  <div className="group flex items-start gap-3 lg:gap-4 p-0">
                    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">🪄</span>
                    <p className="leading-tight text-white">
                      <span 
                        className="font-black text-white"
                        style={{ 
                          textShadow: "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000"
                        }}
                      >
                        Get{" "}
                      </span>
                      <span 
                        className="font-black text-white"
                        style={{ 
                          textShadow: "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000"
                        }}
                      >
                        simple daily outfit ideas
                      </span>
                      <span 
                        className="font-black text-white"
                        style={{ 
                          textShadow: "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000"
                        }}
                      >
                        {" "}tailored to you
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex justify-center lg:justify-end">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
