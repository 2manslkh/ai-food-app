import React from "react";
import { SupabaseLogin } from "./SupabaseLogin";
import Typewriter from "typewriter-effect";

export function LoginScreen() {
  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex flex-grow items-center justify-center">
          <div className="text-center">
            <div className="mb-8">
              <div className="text-5xl font-bold">Nutrimate</div>
            </div>

            <h1 className="mb-8 h-[200px] text-3xl font-bold">
              <Typewriter
                options={{
                  strings: [
                    "Your AI-powered nutrition assistant",
                    "Customized nutrition to your doorstep",
                    "Plan your meals with AI precision",
                    "Discover new, healthy recipes daily",
                    "Achieve your nutrition goals effortlessly",
                    "Personalized meal plans at your fingertips",
                  ],
                  autoStart: true,
                  delay: 50,
                  loop: true,
                }}
              />
            </h1>
          </div>
        </div>
        <div className="mx-auto my-auto flex w-full max-w-md flex-col items-center justify-center px-10 pb-24">
          <SupabaseLogin />
        </div>
      </div>
    </>
  );
}
