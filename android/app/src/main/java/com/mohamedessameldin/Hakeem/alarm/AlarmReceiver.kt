package com.mohamedessameldin.Hakeem.alarm

import android.app.KeyguardManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.PowerManager
import android.os.SystemClock
import androidx.core.app.NotificationCompat

class AlarmReceiver : BroadcastReceiver() {
    companion object {
        const val NOTIFICATION_ID = 9999
        const val CHANNEL_ID = "native_clock_alarm_channel"

        @Volatile
        private var lastScheduleId: String? = null

        @Volatile
        private var lastTriggerAtMs: Long = 0L

        fun stopAlarm(context: Context? = null) {
            AlarmSoundManager.stop(context)
        }

        private fun shouldSkipDuplicate(scheduleId: String): Boolean {
            val now = SystemClock.elapsedRealtime()
            val isDuplicate =
                scheduleId == lastScheduleId && (now - lastTriggerAtMs) < 3000L
            if (!isDuplicate) {
                lastScheduleId = scheduleId
                lastTriggerAtMs = now
            }
            return isDuplicate
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        val scheduleId = intent.getStringExtra("scheduleId") ?: ""
        val title = intent.getStringExtra("title") ?: "Medication Alarm"
        val body = intent.getStringExtra("body") ?: "Time to take your medication"

        if (scheduleId.isNotEmpty() && shouldSkipDuplicate(scheduleId)) {
            return
        }

        val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
        val wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "Hakeem:AlarmReceiverWakeLock"
        )

        try {
            wakeLock.acquire(10 * 1000L)

            AlarmSoundManager.start(context)

            val alarmIntent = buildAlarmActivityIntent(context, scheduleId, title, body)
            val keyguardManager =
                context.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
            val isLocked = keyguardManager.isKeyguardLocked
            val isInteractive = powerManager.isInteractive

            val notificationManager =
                context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            ensureNotificationChannel(notificationManager)

            val contentPendingIntent = PendingIntent.getActivity(
                context,
                scheduleId.hashCode(),
                alarmIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val notificationBuilder = NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
                .setContentTitle(title)
                .setContentText(body)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setContentIntent(contentPendingIntent)
                .setOngoing(true)
                .setAutoCancel(false)

            // Full-screen intent only when the device is locked or the screen is off.
            // Otherwise a direct activity launch is enough and avoids double-starting.
            if (isLocked || !isInteractive) {
                notificationBuilder.setFullScreenIntent(contentPendingIntent, true)
            } else {
                try {
                    context.startActivity(alarmIntent)
                } catch (e: Exception) {
                    e.printStackTrace()
                    notificationBuilder.setFullScreenIntent(contentPendingIntent, true)
                }
            }

            notificationManager.notify(NOTIFICATION_ID, notificationBuilder.build())
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            try {
                if (wakeLock.isHeld) {
                    wakeLock.release()
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun buildAlarmActivityIntent(
        context: Context,
        scheduleId: String,
        title: String,
        body: String
    ): Intent {
        return Intent(context, AlarmActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                    Intent.FLAG_ACTIVITY_CLEAR_TOP or
                    Intent.FLAG_ACTIVITY_SINGLE_TOP or
                    Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
            putExtra("scheduleId", scheduleId)
            putExtra("title", title)
            putExtra("body", body)
        }
    }

    private fun ensureNotificationChannel(notificationManager: NotificationManager) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Medication Alarms",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                setBypassDnd(true)
                lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
            }
            notificationManager.createNotificationChannel(channel)
        }
    }
}
