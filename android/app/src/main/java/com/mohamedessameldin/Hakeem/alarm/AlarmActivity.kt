package com.mohamedessameldin.Hakeem.alarm

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.app.Activity
import android.app.AlarmManager
import android.app.KeyguardManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.database.sqlite.SQLiteDatabase
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.Typeface
import android.graphics.drawable.ColorDrawable
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.view.animation.AccelerateDecelerateInterpolator
import android.view.animation.DecelerateInterpolator
import android.widget.Button
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

class AlarmActivity : Activity() {
    private var scheduleId: String = ""
    private var title: String = "Medication"
    private var reminderType: String = "MEDICATION"
    private var dosage: String? = null
    private var instructions: String? = null
    private var mealRelation: String? = null
    private var mealName: String? = null
    private var frequencyType: String? = null
    private var providerName: String? = null
    private var labName: String? = null

    private val activeAnimators = mutableListOf<AnimatorSet>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 1. Modern Lock Screen Wake & Keyguard Dismissal
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val keyguardManager = getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
            keyguardManager.requestDismissKeyguard(this, null)
        }

        @Suppress("DEPRECATION")
        window.addFlags(
            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
            WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
            WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
            WindowManager.LayoutParams.FLAG_ALLOW_LOCK_WHILE_SCREEN_ON
        )

        // Clean Pure White Background
        window.setBackgroundDrawable(ColorDrawable(Color.WHITE))

        scheduleId = intent.getStringExtra("scheduleId") ?: ""
        title = intent.getStringExtra("title") ?: "Medication"

        // Fetch ALL input attributes from SQLite database
        fetchReminderDetailsFromDatabase()

        val now = Calendar.getInstance()
        val timeFormat = SimpleDateFormat("h:mm a", Locale.ENGLISH)
        val timeString = timeFormat.format(now.time)

        // Root Container
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.WHITE)
            setPadding(48, 80, 48, 48)
            gravity = Gravity.CENTER_HORIZONTAL
        }

        // Top Spacer
        val topSpacer = View(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                0.8f
            )
        }
        root.addView(topSpacer)

        // 2. Icon Container with Expanding Primary Blue Ripple Waves
        val iconContainer = FrameLayout(this).apply {
            layoutParams = LinearLayout.LayoutParams(360, 360).apply {
                gravity = Gravity.CENTER
                setMargins(0, 0, 0, 32)
            }
        }

        val waveRing1 = createWaveRingView(160)
        val waveRing2 = createWaveRingView(160)
        val waveRing3 = createWaveRingView(160)

        val medicalIconView = ImageView(this).apply {
            setImageBitmap(createMedicalIconBitmap())
            layoutParams = FrameLayout.LayoutParams(180, 180).apply {
                gravity = Gravity.CENTER
            }
        }

        iconContainer.addView(waveRing1)
        iconContainer.addView(waveRing2)
        iconContainer.addView(waveRing3)
        iconContainer.addView(medicalIconView)
        root.addView(iconContainer)

        startRippleWaveAnimations(waveRing1, waveRing2, waveRing3, medicalIconView)

        // 3. Category Header Title
        val categoryTitleText = when (reminderType) {
            "APPOINTMENT" -> "Appointment\nReminder"
            "LAB_TEST" -> "Lab Test\nReminder"
            else -> "Medication\nReminder"
        }

        val mainHeader = TextView(this).apply {
            text = categoryTitleText
            textSize = 30f
            setTextColor(Color.parseColor("#0F172A"))
            setTypeface(null, Typeface.BOLD)
            gravity = Gravity.CENTER
            setLineSpacing(6f, 1f)
            setPadding(0, 0, 0, 16)
            alpha = 0f
            translationY = 30f
        }
        root.addView(mainHeader)

        // 4. Specific Reminder Title (Name of Medication / Appointment / Test)
        val titleText = TextView(this).apply {
            text = title
            textSize = 22f
            setTextColor(Color.parseColor("#1D4ED8"))
            setTypeface(null, Typeface.BOLD)
            gravity = Gravity.CENTER
            setPadding(16, 0, 16, 20)
            alpha = 0f
            translationY = 30f
        }
        root.addView(titleText)

        // 5. Time Badge Pill
        val timePillDrawable = GradientDrawable().apply {
            setColor(Color.parseColor("#EFF6FF"))
            cornerRadius = 48f
        }

        val timePillContainer = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            background = timePillDrawable
            setPadding(32, 12, 32, 12)
            gravity = Gravity.CENTER
            alpha = 0f
            translationY = 30f
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                gravity = Gravity.CENTER
                setMargins(0, 0, 0, 24)
            }
        }

        val clockIcon = ImageView(this).apply {
            setImageBitmap(createClockIconBitmap())
            layoutParams = LinearLayout.LayoutParams(32, 32).apply {
                setMargins(0, 0, 12, 0)
            }
        }

        val timeText = TextView(this).apply {
            text = timeString
            textSize = 14f
            setTextColor(Color.parseColor("#1E3A8A"))
            setTypeface(null, Typeface.BOLD)
        }

        timePillContainer.addView(clockIcon)
        timePillContainer.addView(timeText)
        root.addView(timePillContainer)

        // 6. Optional Attributes Card
        val detailsList = mutableListOf<Pair<String, String>>()

        if (!dosage.isNullOrBlank()) {
            detailsList.add(Pair("Dosage", dosage!!))
        }

        val currMealRel = mealRelation
        val currMealName = mealName
        val mealText = when {
            !currMealRel.isNullOrBlank() && !currMealName.isNullOrBlank() -> "${formatEnumValue(currMealRel)} $currMealName"
            !currMealRel.isNullOrBlank() -> formatEnumValue(currMealRel)
            !currMealName.isNullOrBlank() -> currMealName
            else -> null
        }
        if (mealText != null) {
            detailsList.add(Pair("Meal Relation", mealText))
        }

        if (!instructions.isNullOrBlank()) {
            detailsList.add(Pair("Instructions", instructions!!))
        }

        if (!frequencyType.isNullOrBlank()) {
            detailsList.add(Pair("Frequency", formatEnumValue(frequencyType!!)))
        }

        if (!providerName.isNullOrBlank()) {
            detailsList.add(Pair("Doctor / Provider", providerName!!))
        }

        if (!labName.isNullOrBlank()) {
            detailsList.add(Pair("Lab Facility", labName!!))
        }

        if (detailsList.isNotEmpty()) {
            val detailsCardDrawable = GradientDrawable().apply {
                setColor(Color.parseColor("#F8FAFC"))
                cornerRadius = 32f
                setStroke(2, Color.parseColor("#E2E8F0"))
            }

            val detailsCard = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                background = detailsCardDrawable
                setPadding(32, 24, 32, 24)
                gravity = Gravity.CENTER_HORIZONTAL
                alpha = 0f
                translationY = 30f
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 24)
                }
            }

            for (pair in detailsList) {
                val rowLayout = LinearLayout(this).apply {
                    orientation = LinearLayout.HORIZONTAL
                    setPadding(0, 8, 0, 8)
                }

                val labelText = TextView(this).apply {
                    text = "${pair.first}: "
                    textSize = 14f
                    setTextColor(Color.parseColor("#64748B"))
                    setTypeface(null, Typeface.BOLD)
                }

                val valText = TextView(this).apply {
                    text = pair.second
                    textSize = 14f
                    setTextColor(Color.parseColor("#0F172A"))
                }

                rowLayout.addView(labelText)
                rowLayout.addView(valText)
                detailsCard.addView(rowLayout)
            }

            root.addView(detailsCard)
            animateViewEntrance(detailsCard, 350)
        }

        // Bottom Spacer
        val bottomSpacer = View(this).apply {
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1.0f
            )
        }
        root.addView(bottomSpacer)

        // 7. Prominent Full-Width STOP Button
        val stopDrawable = GradientDrawable().apply {
            setColor(Color.parseColor("#1D4ED8"))
            cornerRadius = 24f
        }

        val stopButton = Button(this).apply {
            text = "STOP"
            textSize = 16f
            setTextColor(Color.WHITE)
            setTypeface(null, Typeface.BOLD)
            background = stopDrawable
            alpha = 0f
            translationY = 40f
            setOnClickListener {
                dismissAlarmAndRescheduleNext()
            }
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                144
            )
        }
        root.addView(stopButton)

        setContentView(root)

        // Staggered Entrance Animations
        animateViewEntrance(mainHeader, 150)
        animateViewEntrance(titleText, 220)
        animateViewEntrance(timePillContainer, 290)
        animateViewEntrance(stopButton, 420)
    }

    private fun formatEnumValue(valStr: String): String {
        return when (valStr.uppercase(Locale.ENGLISH)) {
            "BEFORE" -> "Before Meal"
            "AFTER" -> "After Meal"
            "DAILY" -> "Daily"
            "WEEKLY" -> "Weekly"
            "MONTHLY" -> "Monthly"
            "LIFELONG" -> "Lifelong"
            else -> valStr.replace("_", " ").lowercase(Locale.ENGLISH).replaceFirstChar { it.uppercase(Locale.ENGLISH) }
        }
    }

    private fun createWaveRingView(sizeDp: Int): View {
        val drawable = GradientDrawable().apply {
            setColor(Color.parseColor("#2563EB"))
            cornerRadius = 200f
        }
        return View(this).apply {
            background = drawable
            alpha = 0f
            layoutParams = FrameLayout.LayoutParams(sizeDp, sizeDp).apply {
                gravity = Gravity.CENTER
            }
        }
    }

    private fun startRippleWaveAnimations(wave1: View, wave2: View, wave3: View, icon: View) {
        fun createWaveAnimator(view: View, delayMs: Long): AnimatorSet {
            val scaleX = ObjectAnimator.ofFloat(view, "scaleX", 0.95f, 2.1f).apply {
                duration = 1800
                repeatCount = ObjectAnimator.INFINITE
                interpolator = AccelerateDecelerateInterpolator()
            }
            val scaleY = ObjectAnimator.ofFloat(view, "scaleY", 0.95f, 2.1f).apply {
                duration = 1800
                repeatCount = ObjectAnimator.INFINITE
                interpolator = AccelerateDecelerateInterpolator()
            }
            val alpha = ObjectAnimator.ofFloat(view, "alpha", 0.35f, 0.0f).apply {
                duration = 1800
                repeatCount = ObjectAnimator.INFINITE
                interpolator = AccelerateDecelerateInterpolator()
            }
            return AnimatorSet().apply {
                playTogether(scaleX, scaleY, alpha)
                startDelay = delayMs
            }
        }

        val anim1 = createWaveAnimator(wave1, 0)
        val anim2 = createWaveAnimator(wave2, 600)
        val anim3 = createWaveAnimator(wave3, 1200)

        activeAnimators.add(anim1)
        activeAnimators.add(anim2)
        activeAnimators.add(anim3)

        anim1.start()
        anim2.start()
        anim3.start()

        val iconScaleX = ObjectAnimator.ofFloat(icon, "scaleX", 1.0f, 1.08f).apply {
            duration = 1000
            repeatCount = ObjectAnimator.INFINITE
            repeatMode = ObjectAnimator.REVERSE
            interpolator = AccelerateDecelerateInterpolator()
        }
        val iconScaleY = ObjectAnimator.ofFloat(icon, "scaleY", 1.0f, 1.08f).apply {
            duration = 1000
            repeatCount = ObjectAnimator.INFINITE
            repeatMode = ObjectAnimator.REVERSE
            interpolator = AccelerateDecelerateInterpolator()
        }
        val iconAnim = AnimatorSet().apply {
            playTogether(iconScaleX, iconScaleY)
            start()
        }
        activeAnimators.add(iconAnim)
    }

    private fun animateViewEntrance(view: View, delayMs: Long) {
        view.animate()
            .alpha(1.0f)
            .translationY(0f)
            .setDuration(500)
            .setStartDelay(delayMs)
            .setInterpolator(DecelerateInterpolator())
            .start()
    }

    private fun fetchReminderDetailsFromDatabase() {
        try {
            val dbPath = getDatabasePath("hakeem.db")
            if (!dbPath.exists()) return

            val db = SQLiteDatabase.openDatabase(dbPath.absolutePath, null, SQLiteDatabase.OPEN_READONLY)
            val cursor = db.rawQuery(
                """
                SELECT 
                    r.title, 
                    r.reminder_type,
                    mr.dosage, 
                    mr.instructions, 
                    mr.duration_type, 
                    mr.frequency_type, 
                    mr.meal_relation, 
                    mr.meal_name, 
                    ar.provider_name,
                    lr.lab_name
                FROM reminder_schedules rs
                JOIN reminders r ON rs.reminder_id = r.reminder_id
                LEFT JOIN medication_reminders mr ON r.reminder_id = mr.reminder_id
                LEFT JOIN appointment_reminders ar ON r.reminder_id = ar.reminder_id
                LEFT JOIN lab_test_reminders lr ON r.reminder_id = lr.reminder_id
                WHERE rs.schedule_id = ? OR rs.native_alarm_id = ?
                """,
                arrayOf(scheduleId, scheduleId)
            )

            if (cursor.moveToFirst()) {
                val dbTitle = cursor.getString(0)
                val dbType = cursor.getString(1)
                if (!dbTitle.isNullOrEmpty()) {
                    title = dbTitle
                }
                if (!dbType.isNullOrEmpty()) {
                    reminderType = dbType
                }
                dosage = cursor.getString(2)
                instructions = cursor.getString(3)
                frequencyType = cursor.getString(5)
                mealRelation = cursor.getString(6)
                mealName = cursor.getString(7)
                providerName = cursor.getString(8)
                labName = cursor.getString(9)
            }
            cursor.close()
            db.close()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun dismissAlarmAndRescheduleNext() {
        // Stop audio playback & vibration and clear notification
        AlarmSoundManager.stop(this)
        stopAllAnimators()

        // Reschedule next recurring instance in SQLite for tomorrow
        try {
            val dbPath = getDatabasePath("hakeem.db")
            if (dbPath.exists()) {
                val db = SQLiteDatabase.openDatabase(dbPath.absolutePath, null, SQLiteDatabase.OPEN_READONLY)
                val cursor = db.rawQuery(
                    """
                    SELECT rs.schedule_id, rs.native_alarm_id, rs.local_time, r.title, r.is_enabled
                    FROM reminder_schedules rs
                    JOIN reminders r ON rs.reminder_id = r.reminder_id
                    WHERE (rs.schedule_id = ? OR rs.native_alarm_id = ?) AND r.is_enabled = 1
                    """,
                    arrayOf(scheduleId, scheduleId)
                )

                if (cursor.moveToFirst()) {
                    val nextScheduleId = cursor.getString(0)
                    val nativeAlarmId = cursor.getInt(1)
                    val localTime = cursor.getString(2)
                    val alarmTitle = cursor.getString(3)

                    val parts = localTime.split(":")
                    if (parts.size == 2) {
                        val hour = parts[0].toIntOrNull() ?: 8
                        val minute = parts[1].toIntOrNull() ?: 0

                        val calendar = Calendar.getInstance().apply {
                            set(Calendar.HOUR_OF_DAY, hour)
                            set(Calendar.MINUTE, minute)
                            set(Calendar.SECOND, 0)
                            set(Calendar.MILLISECOND, 0)
                            add(Calendar.DAY_OF_YEAR, 1)
                        }

                        val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
                        val alarmIntent = Intent(this, AlarmReceiver::class.java).apply {
                            putExtra("scheduleId", nextScheduleId)
                            putExtra("title", alarmTitle)
                            putExtra("body", "Time to take your $alarmTitle as scheduled.")
                        }

                        val pendingIntent = PendingIntent.getBroadcast(
                            this,
                            nativeAlarmId,
                            alarmIntent,
                            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                        )

                        val showIntent = Intent(this, AlarmActivity::class.java).apply {
                            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
                            putExtra("scheduleId", nextScheduleId)
                            putExtra("title", alarmTitle)
                            putExtra("body", "Time to take your $alarmTitle as scheduled.")
                        }

                        val showPendingIntent = PendingIntent.getActivity(
                            this,
                            nativeAlarmId + 1_000_000,
                            showIntent,
                            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                        )

                        val clockInfo = AlarmManager.AlarmClockInfo(calendar.timeInMillis, showPendingIntent)
                        alarmManager.setAlarmClock(clockInfo, pendingIntent)
                    }
                }
                cursor.close()
                db.close()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        finish()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        scheduleId = intent.getStringExtra("scheduleId") ?: scheduleId
        title = intent.getStringExtra("title") ?: title
        fetchReminderDetailsFromDatabase()
    }

    private fun createMedicalIconBitmap(): Bitmap {
        val size = 180
        val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        val paint = Paint(Paint.ANTI_ALIAS_FLAG)

        paint.color = Color.parseColor("#E0E7FF")
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 3f
        canvas.drawCircle(size / 2f, size / 2f, (size / 2f) - 4f, paint)

        paint.color = Color.parseColor("#FAFAFA")
        paint.style = Paint.Style.FILL
        canvas.drawCircle(size / 2f, size / 2f, (size / 2f) - 6f, paint)

        paint.color = Color.parseColor("#1D4ED8")
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 5.5f
        paint.strokeCap = Paint.Cap.ROUND
        paint.strokeJoin = Paint.Join.ROUND

        val handleRect = RectF((size / 2f) - 16f, (size / 2f) - 34f, (size / 2f) + 16f, (size / 2f) - 22f)
        canvas.drawRoundRect(handleRect, 7f, 7f, paint)

        val bodyRect = RectF((size / 2f) - 32f, (size / 2f) - 22f, (size / 2f) + 32f, (size / 2f) + 28f)
        canvas.drawRoundRect(bodyRect, 10f, 10f, paint)

        paint.style = Paint.Style.FILL
        paint.strokeWidth = 0f
        canvas.drawRect((size / 2f) - 4.5f, (size / 2f) - 13f, (size / 2f) + 4.5f, (size / 2f) + 19f, paint)
        canvas.drawRect((size / 2f) - 16f, (size / 2f) - 1.5f, (size / 2f) + 16f, (size / 2f) + 7.5f, paint)

        return bitmap
    }

    private fun createClockIconBitmap(): Bitmap {
        val size = 32
        val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        val paint = Paint(Paint.ANTI_ALIAS_FLAG)
        paint.color = Color.parseColor("#1E3A8A")
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = 3f

        canvas.drawCircle(size / 2f, size / 2f, (size / 2f) - 3f, paint)

        paint.strokeCap = Paint.Cap.ROUND
        canvas.drawLine(size / 2f, size / 2f, size / 2f, (size / 2f) - 7f, paint)
        canvas.drawLine(size / 2f, size / 2f, (size / 2f) + 6f, size / 2f, paint)

        return bitmap
    }

    private fun stopAllAnimators() {
        activeAnimators.forEach { it.cancel() }
        activeAnimators.clear()
    }

    override fun onDestroy() {
        stopAllAnimators()
        super.onDestroy()
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // User must tap STOP button to dismiss alarm
    }
}
