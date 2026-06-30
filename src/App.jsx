import { useState } from 'react'
import { contrastRatio, wcagResult, expandHex, isValidHex } from './utilities/colourUtils'

import './assets/scss/main.scss'

function App() {
  const [colourForeground, setColourForeground] = useState('')
  const [colourBackground, setColourBackground] = useState('')
  const [colourResults, setColourResults] = useState(null)
  const [inputErrors, setInputErrors] = useState({ fgError: false, bgError: false })

  function handleInputChange(e, inputType) {
    let value = e.target.value

    //== auto-prepend a # if missing
    if (value && !value.startsWith('#')) {
      value = '#' + value
    }

    //== strip any character that isn't # or a valid hex digit
    value = value.replace(/[^#0-9a-fA-F]/g, '')

    //== ensure the # only appears at the start
    value = '#' + value.replace(/#/g, '')

    //== clamp to max length (#rrggbb = 7 chars)
    value = value.slice(0, 7)

    if (inputType === 'foreground') setColourForeground(value)
    if (inputType === 'background') setColourBackground(value)
  }

  function handleOnSubmit(e) {
    e.preventDefault()

    const fgError = !isValidHex(colourForeground)
    const bgError = !isValidHex(colourBackground)

    setInputErrors({ fgError, bgError })

    if (!fgError && !bgError) {
      const ratio = contrastRatio(expandHex(colourForeground), expandHex(colourBackground))
      const results = wcagResult(ratio)
      setColourResults(results)
    }
  }

  return (
    <main>
      <div className='wrapper-section'>
        <div className='ui-grid'>
          <div className='medium-12 cell ui-flex-gap'>
            {/* START: intro */}
            <div className='ui-panel'>
              <div className='content-flow'>
                <h1>Colour contrast checker</h1>
                <p>
                  Enter a foreground and background colour as a hex value to check the contrast ratio between them. The
                  result will show whether the combination passes or fails WCAG 2.2 AA and AAA standards for both normal
                  and large text.
                </p>
              </div>
              <span aria-hidden='true' className='material-symbols-rounded ui-icon'>
                verified
              </span>
            </div>
            {/* END: intro */}

            {/* START: form */}
            <div className='ui-panel'>
              <form onSubmit={handleOnSubmit} className='ui-grid ui-form'>
                <div className='small-6 cell form-input-item'>
                  <label htmlFor='txtFG'>Foreground colour</label>
                  <input
                    id='txtFG'
                    type='text'
                    value={colourForeground}
                    onChange={(e) => handleInputChange(e, 'foreground')}
                    placeholder='e.g. #063583'
                    maxLength='7'
                    autoComplete='off'
                    autoCorrect='off'
                    autoCapitalize='off'
                    spellCheck='false'
                    inputMode='text'
                    aria-invalid={inputErrors.fgError}
                    aria-describedby={inputErrors.fgError ? 'error-fg' : undefined}
                  ></input>
                  <div aria-live='polite'>
                    {inputErrors.fgError && (
                      <p className='msg-caption msg-caption--alert' id='error-fg'>
                        <span aria-hidden='true' className='material-symbols-rounded'>
                          warning
                        </span>
                        please enter a valid hex value e.g. #063583
                      </p>
                    )}
                  </div>
                </div>
                <div className='small-6 cell form-input-item'>
                  <label htmlFor='txtBG'>Background colour</label>
                  <input
                    id='txtBG'
                    type='text'
                    value={colourBackground}
                    onChange={(e) => handleInputChange(e, 'background')}
                    placeholder='e.g. #FFFFFF'
                    maxLength='7'
                    autoComplete='off'
                    autoCorrect='off'
                    autoCapitalize='off'
                    spellCheck='false'
                    inputMode='text'
                    aria-invalid={inputErrors.bgError}
                    aria-describedby={inputErrors.bgError ? 'error-bg' : undefined}
                  ></input>
                  <div aria-live='polite'>
                    {inputErrors.bgError && (
                      <p className='msg-caption msg-caption--alert' id='error-bg'>
                        <span aria-hidden='true' className='material-symbols-rounded'>
                          warning
                        </span>
                        please enter a valid hex value e.g. #FFFFFF
                      </p>
                    )}
                  </div>
                </div>
                <div className='medium-6 large-3 cell'>
                  <button className='btn-main btn-main--expanded' type='submit'>
                    Check Contrast
                    <span aria-hidden='true' className='material-symbols-rounded'>
                      check
                    </span>
                  </button>
                </div>
              </form>
              <span aria-hidden='true' className='material-symbols-rounded ui-icon'>
                palette
              </span>
            </div>
            {/* END: form */}

            {/* START: results */}
            <div aria-live='polite'>
              {colourResults && (
                <>
                  <div className='ui-grid'>
                    <div className='large-6 cell'>
                      {/* results */}
                      <div className='ui-panel'>
                        <div className='ui-grid'>
                          <div className='medium-12 cell'>
                            <h2 className='text-lg'>Contrast Ratio: {colourResults.ratio}</h2>
                          </div>
                        </div>

                        <div className='ui-grid medium-up-2 small-up-2 colour-results'>
                          {colourResults.results.map((resultItem) => (
                            <div key={resultItem.id} className='cell'>
                              <dl>
                                <dt className='text-md'>{resultItem.label}</dt>
                                <dd className='text-sm'>
                                  {resultItem.pass ? 'Pass' : 'Fail'}
                                  {resultItem.pass ? (
                                    <span aria-hidden='true' className='material-symbols-rounded ui-icon'>
                                      check
                                    </span>
                                  ) : (
                                    <span aria-hidden='true' className='material-symbols-rounded ui-icon'>
                                      close
                                    </span>
                                  )}
                                </dd>
                              </dl>
                            </div>
                          ))}
                        </div>
                        <span aria-hidden='true' className='material-symbols-rounded ui-icon'>
                          contrast_circle
                        </span>
                      </div>
                    </div>
                    <div className='large-6 cell'>
                      {/* example */}
                      <div
                        className='ui-panel ui-panel--example'
                        style={{ '--ui-panel-surface': colourBackground, '--ui-panel-text': colourForeground }}
                      >
                        <div className='content-flow'>
                          <h2>Example</h2>
                          <p className='lead'>The quick brown fox jumps over the lazy dog.</p>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat.
                          </p>
                        </div>
                        <span aria-hidden='true' className='material-symbols-rounded ui-icon'>
                          type_specimen
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* END: results */}
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
