import React from 'react';
import { View } from 'react-native';

function MedicalCvCardSkeleton() {
    return (
        <View className="mb-4 rounded-[24px] border border-text2-50 bg-surface p-5">
            <View className="flex-row items-center">
                <View className="h-14 w-14 rounded-full bg-text2-50" />

                <View className="ml-4 flex-1">
                    <View className="h-4 w-3/4 rounded-full bg-text2-50" />
                    <View className="mt-3 h-7 w-20 rounded-full bg-text2-50" />
                </View>
            </View>

            <View className="mt-6 h-3 w-16 rounded-full bg-text2-50" />
            <View className="mt-3 h-4 w-1/2 rounded-full bg-text2-50" />

            <View className="mt-5 flex-row items-center justify-between border-t border-text2-50 pt-4">
                <View className="h-4 w-28 rounded-full bg-text2-50" />
                <View className="h-7 w-20 rounded-full bg-text2-50" />
            </View>
        </View>
    );
}

export function MedicalCvListSkeleton() {
    return (
        <>
            <View className="mb-6 h-20 rounded-2xl bg-primary-50 opacity-60" />

            <MedicalCvCardSkeleton />
            <MedicalCvCardSkeleton />
        </>
    );
}