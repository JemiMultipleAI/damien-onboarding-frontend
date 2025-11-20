'use client'

import { useEffect, useRef, useState } from 'react'
import { loadElevenLabsScript } from '@/utils/loadElevenLabsScript'

interface ElevenLabsChatbotProps {
  agentId: string
  avatarImageUrl?: string
  avatarOrbColor1?: string
  avatarOrbColor2?: string
  actionText?: string
  customColors?: {
    primary?: string
    secondary?: string
  }
  className?: string
  autoStart?: boolean
}

export default function ElevenLabsChatbot({
  agentId,
  avatarImageUrl,
  avatarOrbColor1 = '#6DB035',
  avatarOrbColor2 = '#F5CABB',
  actionText,
  customColors,
  className,
  autoStart = false,
}: ElevenLabsChatbotProps) {
  const widgetRef = useRef<HTMLDivElement>(null)
  const [scriptReady, setScriptReady] = useState(false)

  // Ensure script is loaded before rendering widget
  useEffect(() => {
    loadElevenLabsScript()
      .then(() => {
        // Wait for custom element to be registered (max 5 seconds)
        let attempts = 0
        const maxAttempts = 50
        
        const checkCustomElement = () => {
          attempts++
          // Check if custom element is defined
          if (customElements.get('elevenlabs-convai')) {
            setScriptReady(true)
            console.log('✅ ElevenLabs custom element registered, widget can render')
          } else if (attempts < maxAttempts) {
            // Try again after a short delay
            setTimeout(checkCustomElement, 100)
          } else {
            console.error('❌ ElevenLabs custom element not registered after 5 seconds')
            // Still try to render - maybe it will work
            setScriptReady(true)
          }
        }
        checkCustomElement()
      })
      .catch((error) => {
        console.error('❌ Failed to load ElevenLabs script:', error)
      })
  }, [])

  useEffect(() => {
    if (!widgetRef.current) return

    // Hide any floating widgets outside our container
    const hideFloatingWidgets = () => {
      // Find all elevenlabs-convai elements
      const allWidgets = document.querySelectorAll('elevenlabs-convai')
      
      allWidgets.forEach((widget) => {
        // Check if this widget is inside our container
        const isInOurContainer = widgetRef.current?.contains(widget)
        
        if (!isInOurContainer) {
          // This is a floating widget - hide it
          const element = widget as HTMLElement
          element.style.display = 'none'
          element.style.visibility = 'hidden'
          element.style.position = 'absolute'
          element.style.left = '-9999px'
          element.style.zIndex = '-1'
        }
      })
    }

    // Inject styles into shadow DOM for our widget only
    const injectShadowStyles = () => {
      // Only find widget inside our container
      const chatbotElement = widgetRef.current?.querySelector('elevenlabs-convai')
      if (!chatbotElement) {
        console.log('⚠️ ElevenLabs widget element not found yet')
        return
      }

      const shadowRoot = chatbotElement.shadowRoot
      if (!shadowRoot) {
        console.log('⚠️ ElevenLabs widget shadow root not found yet')
        return
      }

      console.log('✅ Found ElevenLabs widget, forcing chat interface to be visible')
      console.log('Shadow DOM structure:', shadowRoot.innerHTML.substring(0, 500)) // Debug: log first 500 chars

      // Get all overlay divs in shadow root and hide the last one (the "Powered by ElevenLabs" footer)
      const allOverlays = shadowRoot.querySelectorAll('.overlay')
      if (allOverlays.length > 1) {
        const lastOverlay = allOverlays[allOverlays.length - 1] as HTMLElement
        lastOverlay.style.setProperty('display', 'none', 'important')
      }

      // Force the chat interface to be visible and expanded
      // Strategy: Find all elements and make chat-related ones visible, hide collapsed states
      
      // First, find and hide any collapsed/minimized/button states
      // Look for the circular buttons/icons that appear when collapsed
      const allElements = shadowRoot.querySelectorAll('*')
      allElements.forEach((el) => {
        const element = el as HTMLElement
        const className = element.className?.toString().toLowerCase() || ''
        const id = element.id?.toLowerCase() || ''
        const tagName = element.tagName?.toLowerCase() || ''
        
        // Hide circular buttons/icons (the collapsed widget state)
        // These are usually buttons or divs with specific styling
        if (tagName === 'button' || tagName === 'div') {
          const styles = window.getComputedStyle(element)
          const borderRadius = styles.borderRadius
          const position = styles.position
          
          // Hide circular/floating buttons (usually have border-radius: 50% and fixed/absolute position)
          if ((borderRadius.includes('50%') || borderRadius.includes('9999px')) && 
              (position === 'fixed' || position === 'absolute')) {
            // Check if it's in bottom right area (collapsed widget buttons)
            const rect = element.getBoundingClientRect()
            if (rect.width < 100 && rect.height < 100) { // Small circular buttons
              element.style.setProperty('display', 'none', 'important')
              element.style.setProperty('visibility', 'hidden', 'important')
            }
          }
        }
        
        // Hide collapsed/minimized states and initial buttons
        if (element.tagName === 'BUTTON' && 
            (className.includes('toggle') || className.includes('open') || 
             className.includes('start') || className.includes('call') ||
             className.includes('minimize') || className.includes('collapse') ||
             id.includes('toggle') || id.includes('open'))) {
          // Only hide if it's a toggle/start button, not send/submit buttons
          if (!className.includes('send') && !className.includes('submit') &&
              !id.includes('send') && !id.includes('submit')) {
            element.style.setProperty('display', 'none', 'important')
          }
        }
        
        // Hide collapsed/minimized containers
        if (className.includes('collapsed') || className.includes('minimized') ||
            className.includes('hidden') || id.includes('collapsed') || id.includes('minimized')) {
          element.style.setProperty('display', 'none', 'important')
        }
      })

      // Find and show the chat interface/container - be more aggressive
      // First, try to find and expand the main chat container
      const chatKeywords = ['chat', 'conversation', 'interface', 'panel', 'messages', 'content', 'main', 'body', 'widget', 'container']
      chatKeywords.forEach((keyword) => {
        const selectors = [
          `[class*="${keyword}"]`,
          `[id*="${keyword}"]`,
          `[class*="${keyword}-container"]`,
          `[class*="${keyword}-wrapper"]`,
          `[class*="${keyword}-panel"]`,
        ]
        
        selectors.forEach((selector) => {
          try {
            const elements = shadowRoot.querySelectorAll(selector)
            elements.forEach((el) => {
              const element = el as HTMLElement
              const className = element.className?.toString().toLowerCase() || ''
              // Don't hide elements that are meant to be visible
              if (!className.includes('hidden') && !className.includes('collapsed') && 
                  !className.includes('minimized') && !className.includes('button')) {
                element.style.setProperty('display', 'block', 'important')
                element.style.setProperty('visibility', 'visible', 'important')
                element.style.setProperty('opacity', '1', 'important')
                // Make sure it takes full space if it's a container
                if (className.includes('container') || className.includes('wrapper') || 
                    className.includes('panel') || className.includes('main') ||
                    className.includes('chat') || className.includes('conversation')) {
                  element.style.setProperty('height', '100%', 'important')
                  element.style.setProperty('width', '100%', 'important')
                  element.style.setProperty('min-height', '100%', 'important')
                  element.style.setProperty('position', 'relative', 'important')
                }
              }
            })
          } catch (e) {
            // Continue
          }
        })
      })
      
      // Also try to find the main content area by looking for large containers
      const allDivs = shadowRoot.querySelectorAll('div')
      allDivs.forEach((div) => {
        const element = div as HTMLElement
        const rect = element.getBoundingClientRect()
        // If it's a large container (likely the main chat area), make sure it's visible
        if (rect.width > 200 && rect.height > 200) {
          const className = element.className?.toString().toLowerCase() || ''
          if (!className.includes('hidden') && !className.includes('collapsed')) {
            element.style.setProperty('display', 'block', 'important')
            element.style.setProperty('visibility', 'visible', 'important')
            element.style.setProperty('opacity', '1', 'important')
          }
        }
      })

      // Ensure the widget renders inline and expanded (not as floating button)
      const existingStyle = shadowRoot.querySelector('style[data-inline-override]')
      if (!existingStyle) {
        const inlineStyle = document.createElement('style')
        inlineStyle.setAttribute('data-inline-override', 'true')
        inlineStyle.textContent = `
          :host {
            display: block !important;
            position: relative !important;
            width: 100% !important;
            height: 100% !important;
            min-height: 100% !important;
          }
          /* Force all containers to be visible and full size */
          * {
            box-sizing: border-box;
          }
          /* Force chat interface to be visible */
          [class*="chat"],
          [class*="conversation"],
          [class*="interface"],
          [class*="panel"],
          [class*="container"],
          [class*="wrapper"],
          [class*="content"],
          [class*="main"],
          [class*="body"] {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            height: 100% !important;
            width: 100% !important;
            min-height: 100% !important;
          }
          /* Hide collapsed/minimized states and buttons */
          [class*="collapsed"],
          [class*="minimized"],
          [class*="hidden"],
          [class*="button"]:not([class*="send"]):not([class*="submit"]):not([class*="input"]),
          button:not([class*="send"]):not([class*="submit"]):not([class*="input"]) {
            display: none !important;
          }
          /* Force root container to fill space */
          :host > * {
            display: block !important;
            width: 100% !important;
            height: 100% !important;
            min-height: 100% !important;
          }
        `
        shadowRoot.appendChild(inlineStyle)
      }
      
      // Also try to force the root element of shadow DOM to be visible
      const rootElement = shadowRoot.firstElementChild as HTMLElement
      if (rootElement) {
        console.log('Root element tag:', rootElement.tagName, 'classes:', rootElement.className)
        rootElement.style.setProperty('display', 'block', 'important')
        rootElement.style.setProperty('width', '100%', 'important')
        rootElement.style.setProperty('height', '100%', 'important')
        rootElement.style.setProperty('min-height', '100%', 'important')
        
        // Log all child elements for debugging
        const children = Array.from(rootElement.children)
        console.log('Root element children:', children.length, children.map(c => ({
          tag: c.tagName,
          classes: c.className,
          id: c.id
        })))
      }
    }

    // Hide floating widgets immediately and periodically
    hideFloatingWidgets()
    const hideInterval = setInterval(hideFloatingWidgets, 500)

    // Inject styles for our widget
    injectShadowStyles()
    const styleInterval = setInterval(injectShadowStyles, 100)

    return () => {
      clearInterval(hideInterval)
      clearInterval(styleInterval)
    }
  }, [agentId])

  // Auto-start conversation and expand chat interface when widget becomes visible
  useEffect(() => {
    if (!autoStart || !widgetRef.current) return

    const attemptAutoStart = () => {
      const chatbotElement = widgetRef.current?.querySelector('elevenlabs-convai')
      if (!chatbotElement) return false

      const shadowRoot = chatbotElement.shadowRoot
      if (!shadowRoot) return false

      // First, try to expand/show the chat interface
      // Look for circular buttons (the collapsed widget buttons visible in bottom right)
      const allButtons = shadowRoot.querySelectorAll('button, div[role="button"], div[onclick]')
      for (const button of allButtons) {
        try {
          const element = button as HTMLElement
          if (element && element.offsetParent !== null) {
            const rect = element.getBoundingClientRect()
            const styles = window.getComputedStyle(element)
            const borderRadius = styles.borderRadius
            const position = styles.position
            
            // Check if it's a circular button (collapsed widget) - small, circular, positioned
            if (rect.width < 100 && rect.height < 100 && 
                (borderRadius.includes('50%') || borderRadius.includes('9999px') || 
                 borderRadius.includes('100%')) &&
                (position === 'fixed' || position === 'absolute' || position === 'relative')) {
              console.log('✅ Found circular button (collapsed widget), clicking to expand')
              element.click()
              element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
              // Wait a bit for expansion, then continue
              setTimeout(() => {}, 200)
            }
          }
        } catch (e) {
          // Continue
        }
      }

      // Also try expand/toggle buttons
      const expandSelectors = [
        'button[aria-label*="expand" i]',
        'button[aria-label*="open" i]',
        'button[aria-label*="show" i]',
        '[class*="expand"]',
        '[class*="toggle"]',
      ]

      for (const selector of expandSelectors) {
        try {
          const element = shadowRoot.querySelector(selector) as HTMLElement
          if (element && element.offsetParent !== null) {
            const rect = element.getBoundingClientRect()
            if (rect.width > 0 && rect.height > 0) {
              element.click()
              element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
              console.log('✅ Clicked expand button')
            }
          }
        } catch (e) {
          // Continue
        }
      }

      // Try to find and click the start/call button
      const possibleSelectors = [
        'button[aria-label*="call" i]',
        'button[aria-label*="start" i]',
        'button[aria-label*="begin" i]',
        '.call-button',
        '.start-button',
        'button[type="button"]:not([class*="close"]):not([class*="minimize"])',
      ]

      for (const selector of possibleSelectors) {
        try {
          const button = shadowRoot.querySelector(selector) as HTMLElement
          if (button && button.offsetParent !== null) {
            // Check if button is visible and clickable
            const rect = button.getBoundingClientRect()
            if (rect.width > 0 && rect.height > 0) {
              // Check if it's not a close/minimize button
              const text = button.textContent?.toLowerCase() || ''
              const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || ''
              if (!text.includes('close') && !text.includes('minimize') &&
                  !ariaLabel.includes('close') && !ariaLabel.includes('minimize')) {
                button.click()
                console.log('✅ Auto-started conversation')
                return true
              }
            }
          }
        } catch (e) {
          // Continue to next selector
        }
      }

      // Alternative: Try to find any clickable button that's visible (excluding close/minimize)
      const remainingButtons = shadowRoot.querySelectorAll('button')
      for (const button of remainingButtons) {
        if (button.offsetParent !== null) {
          const rect = button.getBoundingClientRect()
          if (rect.width > 0 && rect.height > 0) {
            const text = button.textContent?.toLowerCase() || ''
            const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || ''
            // Skip close/minimize buttons
            if (text.includes('close') || text.includes('minimize') ||
                ariaLabel.includes('close') || ariaLabel.includes('minimize')) {
              continue
            }
            if (text.includes('call') || text.includes('start') || text.includes('begin') ||
                ariaLabel.includes('call') || ariaLabel.includes('start') || ariaLabel.includes('begin')) {
              button.click()
              console.log('✅ Auto-started conversation via button text/aria-label')
              return true
            }
          }
        }
      }

      return false
    }

    let attempts = 0
    const maxAttempts = 30 // Try for 3 seconds (30 * 100ms)
    
    const tryStart = () => {
      attempts++
      if (attemptAutoStart() || attempts >= maxAttempts) {
        return
      }
      setTimeout(tryStart, 100)
    }

    // Start trying after a delay to let widget initialize
    const timeout = setTimeout(() => {
      tryStart()
    }, 500)

    return () => clearTimeout(timeout)
  }, [autoStart, agentId])

  const attributes: Record<string, string> = {
    'agent-id': agentId,
    'data-inline': 'true',
    'variant': 'expanded', // Force expanded view to show chat interface directly
  }

  if (avatarImageUrl) {
    attributes['avatar-image-url'] = avatarImageUrl
  }

  if (actionText) {
    attributes['action-text'] = actionText
  }

  if (customColors?.primary) {
    attributes['avatar-orb-color-1'] = customColors.primary
  }

  if (customColors?.secondary) {
    attributes['avatar-orb-color-2'] = customColors.secondary
  }

  // Don't render widget until script is ready
  if (!scriptReady) {
    return (
      <div 
        className={className} 
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>Loading chatbot...</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>Waiting for ElevenLabs script...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={widgetRef} 
      className={className} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#fff' // Ensure white background
      }}
    >
      <elevenlabs-convai 
        {...attributes} 
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '100%', 
          minHeight: '100%',
          position: 'relative',
          flex: '1 1 auto'
        }} 
      />
      {/* Debug: Check if widget element exists */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          fontSize: '10px', 
          color: '#999',
          padding: '4px',
          zIndex: 9999,
          pointerEvents: 'none'
        }}>
          Widget rendered: {widgetRef.current?.querySelector('elevenlabs-convai') ? 'Yes' : 'No'}
        </div>
      )}
    </div>
  )
}

