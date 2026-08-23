package com.mohamedessameldin.Hakeem.alarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.database.sqlite.SQLiteDatabase
import java.util.Calendar

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED || intent.action == "android.intent.action.QUICKBOOT_POWERON") {
            rescheduleAllAlarms(context)
        }
    }

    private fun rescheduleAllAlarms(context: Context) {
        var db: SQLiteDatabase? = null
        try {
            val dbPath = context.getDatabasePath("hakeem.db")
            if (!dbPath.exists()) return

            db = SQLiteDatabase.openDatabase(dbPath.absolutePath, null, SQLiteDatabase.OPEN_READONLY)
            val cursor = db.rawQuery(
                """
                SELECT rs.schedule_id, rs.native_alarm_id, rs.local_time, r.title, r.is_enabled
                FROM reminder_schedules rs
                JOIN reminders r ON rs.reminder_id = r.reminder_id
                WHERE rs.delivery_mode = 'ALARM' AND r.is_enabled = 1 AND rs.native_alarm_id IS NOT NULL
                """,
                null
            )

            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

            cursor.use { c ->
                while (c.moveToNext()) {
                    val scheduleId = c.getString(0)
                    val nativeAlarmId = c.getInt(1)
                    val localTime = c.getString(2)
                    val title = c.getString(3)

                    val parts = localTime.split(":")
                    if (parts.size == 2) {
                        val hour = parts[0].toIntOrNull() ?: 8
                        val minute = parts[1].toIntOrNull() ?: 0

                        val now = Calendar.getInstance()
                        val calendar = Calendar.getInstance().apply {
                            set(Calendar.HOUR_OF_DAY, hour)
                            set(Calendar.MINUTE, minute)
                            set(Calendar.SECOND, 0)
                            set(Calendar.MILLISECOND, 0)
                            if (before(now)) {
                                add(Calendar.DAY_OF_YEAR, 1)
                            }
                        }

                        val alarmIntent = Intent(context, AlarmReceiver::class.java).apply {
                            putExtra("scheduleId", scheduleId)
                            putExtra("title", title)
                            putExtra("body", "Scheduled medication alarm")
                        }

                        val pendingIntent = PendingIntent.getBroadcast(
                            context,
                            nativeAlarmId,
                            alarmIntent,
                            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                        )

                        val showIntent = Intent(context, AlarmActivity::class.java).apply {
                            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
                            putExtra("scheduleId", scheduleId)
                            putExtra("title", title)
                            putExtra("body", "Scheduled medication alarm")
                        }

                        val showPendingIntent = PendingIntent.getActivity(
                            context,
                            nativeAlarmId + 1_000_000,
                            showIntent,
                            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                        )

                        val clockInfo = AlarmManager.AlarmClockInfo(calendar.timeInMillis, showPendingIntent)
                        alarmManager.setAlarmClock(clockInfo, pendingIntent)
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            try {
                db?.close()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
