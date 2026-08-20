import React from 'react';
import { View } from 'react-native';

export function MedicalCvVersionsSkeleton() {
    return (
        <>
            <View className="rounded-[24px] border border-text2-50 bg-surface p-5">
                <View className="flex-row items-center">
                    <View className="h-14 w-14 rounded-full bg-text2-50" />

                    <View className="ml-4 flex-1">
                        <View className="h-4 w-4/5 rounded-full bg-text2-50" />
                        <View className="mt-3 h-7 w-20 rounded-full bg-text2-50" />
                    </View>
                </View>

                <View className="mt-6 border-t border-text2-50 pt-4">
                    <View className="h-3 w-14 rounded-full bg-text2-50" />
                    <View className="mt-3 h-4 w-1/2 rounded-full bg-text2-50" />
                </View>
            </View>

            <View className="mt-5 flex-row">
                <View className="flex-1">
                    <View className="h-3 w-16 rounded-full bg-text2-50" />
                    <View className="mt-2 h-4 w-24 rounded-full bg-text2-50" />
                </View>

                <View className="mx-4 h-10 w-px bg-text2-50" />

                <View className="flex-1">
                    <View className="h-3 w-16 rounded-full bg-text2-50" />
                    <View className="mt-2 h-4 w-24 rounded-full bg-text2-50" />
                </View>
            </View>

            <View className="mb-4 mt-8">
                <View className="h-6 w-28 rounded-full bg-text2-50" />
                <View className="mt-3 h-4 w-20 rounded-full bg-text2-50" />
            </View>

            <View className="rounded-[24px] border border-text2-50 bg-surface p-5">
                <View className="flex-row items-center">
                    <View className="h-12 w-12 rounded-full bg-text2-50" />

                    <View className="ml-4 h-5 w-28 rounded-full bg-text2-50" />
                </View>

                <View className="mt-5 h-12 rounded-2xl bg-text2-50" />
                <View className="mt-4 h-12 rounded-2xl bg-text2-50" />
                <View className="mt-5 h-12 rounded-2xl bg-text2-50" />
            </View>
        </>
    );
}