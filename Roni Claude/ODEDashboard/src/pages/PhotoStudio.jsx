import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader.jsx'
import '../styles/photo-studio.css'

export default function PhotoStudio() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)

  // Mock demo images
  const demoImages = [
    { id: 1, name: 'מנת אוכל', path: 'https://via.placeholder.com/500x400?text=Food' },
    { id: 2, name: 'מוצר טכני', path: 'https://via.placeholder.com/500x400?text=Tech+Product' },
    { id: 3, name: 'מקום עבודה', path: 'https://via.placeholder.com/500x400?text=Workspace' },
  ]

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target.result)
        setSliderPosition(50)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDemoImage = (imagePath) => {
    setUploadedImage(imagePath)
    setSliderPosition(50)
  }

  const handleEnhance = async () => {
    if (!uploadedImage) return
    setIsProcessing(true)
    setProcessingProgress(0)

    // Simulate processing
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 30
      })
    }, 200)

    // Complete after 1.5 seconds
    setTimeout(() => {
      setIsProcessing(false)
      setProcessingProgress(100)
      setTimeout(() => setProcessingProgress(0), 500)
    }, 1500)
  }

  const currentImage = uploadedImage || demoImages[0].path

  return (
    <div className="page-photo-studio">
      <PageHeader
        title="אולפן צילום"
        subtitle="שדרוג צילומים למחזור יצירתי"
      />

      {/* Upload Section */}
      <section className="studio-section">
        <h2 className="section-title">העלה צילום</h2>
        <div className="upload-area">
          <div className="upload-input-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="upload-input"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="upload-label">
              <div className="upload-icon">⬆</div>
              <div className="upload-text">גרור תמונה או לחץ להעלאה</div>
              <div className="upload-hint">PNG, JPG, WebP עד 10MB</div>
            </label>
          </div>
        </div>

        {/* Demo Images */}
        <div className="demo-section">
          <div className="demo-label">או בחר תמונת ניסיון:</div>
          <div className="demo-grid">
            {demoImages.map((img) => (
              <button
                key={img.id}
                className={`demo-image ${currentImage === img.path && !isProcessing ? 'active' : ''}`}
                onClick={() => handleDemoImage(img.path)}
              >
                <div className="demo-preview" style={{ backgroundImage: `url(${img.path})` }} />
                <div className="demo-name">{img.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Slider */}
      <section className="studio-section">
        <h2 className="section-title">השוואה לפני ואחרי</h2>
        <div className="slider-container">
          <div
            className="slider-before"
            style={{
              backgroundImage: `url(${currentImage})`,
            }}
          >
            <div className="before-label">לפני</div>
          </div>
          <div
            className="slider-after"
            style={{
              backgroundImage: `url(${currentImage})`,
              backgroundBlendMode: 'screen',
              filter: 'contrast(1.2) saturate(1.3) brightness(1.05) blur(0.5px)',
              width: `${sliderPosition}%`,
            }}
          >
            <div className="after-label">אחרי</div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="slider-handle"
            disabled={isProcessing}
          />
        </div>
      </section>

      {/* Processing Status */}
      {isProcessing && (
        <section className="studio-section">
          <div className="processing-card">
            <div className="processing-spinner" />
            <div className="processing-title">משדרגת את התמונה...</div>
            <div className="processing-progress">
              <div
                className="progress-bar"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            <div className="processing-text">
              {Math.round(processingProgress)}% · מעבדת תמונות בעיבוד
            </div>
          </div>
        </section>
      )}

      {/* Actions */}
      <section className="studio-section">
        <div className="action-buttons">
          <button
            className="btn-enhance"
            onClick={handleEnhance}
            disabled={!uploadedImage || isProcessing}
          >
            {isProcessing ? 'משדרגת...' : 'שדרוג תמונה'}
          </button>
          <button className="btn-download" disabled={!uploadedImage || isProcessing}>
            הורד תמונה
          </button>
        </div>
      </section>

      {/* Info Cards */}
      <section className="studio-section">
        <h2 className="section-title">על השדרוג</h2>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">⚙</div>
            <div className="info-title">תיקון אור</div>
            <div className="info-desc">ניצול אופטימלי של אור טבעי וחיזוק צבעים</div>
          </div>
          <div className="info-card">
            <div className="info-icon">🎨</div>
            <div className="info-title">שיפור צבע</div>
            <div className="info-desc">ייווצוג צבע טבעי ויותר בהיר</div>
          </div>
          <div className="info-card">
            <div className="info-icon">📐</div>
            <div className="info-title">אותנטיות</div>
            <div className="info-desc">שמירה על הפרטים המקוריים ללא מימוש מלאכותי</div>
          </div>
        </div>
      </section>
    </div>
  )
}
