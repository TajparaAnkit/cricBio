import { Formik } from 'formik'
import React from 'react'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'

const HorizontalStepper: React.FC = () => {
  const history = useHistory()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isSubmitting, setSubmitting] = React.useState(false)
  const initialValues = {
    team1: '',
    team2: '',
    maxOver: '',
    batting: '',
  }
  const validationSchema = Yup.object().shape({
    team1: Yup.string().required('Team Name is required'),
    team2: Yup.string().required('Team Name is required'),
    maxOver: Yup.string().required('Over is required'),
    batting: Yup.string().required('Please choose who is Batting'),
  })
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <span className="text-8xl animate-bounce drop-shadow-lg">🏏</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            Welcome to
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-yellow-300 mb-8 drop-shadow-lg">
            CricBio
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-md mx-auto drop-shadow-md">
            Experience the thrill of cricket scoring like never before
          </p>
        </div>

        {/* Start Game Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 px-12 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-3xl text-xl border-4 border-white/20"
        >
          🏏 Start Your Game
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Game Setup</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <Formik
                  enableReinitialize
                  validationSchema={validationSchema}
                  initialValues={initialValues}
                  onSubmit={(values, actions) => {
                    setSubmitting(true)
                    const data = JSON.stringify(values)
                    localStorage.setItem('data', data)
                    setIsModalOpen(false)
                    history.push('/score')
                    setSubmitting(false)
                  }}
                >
                  {(prp) => {
                    const { values, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue } = prp
                    return (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Team Names */}
                        <div>
                          <div className="mb-4">
                            <label htmlFor="team1" className="block text-sm font-medium text-gray-700 mb-2">
                              Team 1 Name*
                            </label>
                            <input
                              id="team1"
                              name="team1"
                              type="text"
                              value={values.team1}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.team1 && touched.team1 ? 'border-red-500' : 'border-gray-300'
                                }`}
                              placeholder="Enter team 1 name"
                            />
                            {errors.team1 && touched.team1 && (
                              <p className="mt-1 text-sm text-red-600">{errors.team1}</p>
                            )}
                          </div>

                          <div className="flex justify-center my-4">
                            <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-600 font-semibold">VS</span>
                          </div>

                          <div className="mb-4">
                            <label htmlFor="team2" className="block text-sm font-medium text-gray-700 mb-2">
                              Team 2 Name*
                            </label>
                            <input
                              id="team2"
                              name="team2"
                              type="text"
                              value={values.team2}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.team2 && touched.team2 ? 'border-red-500' : 'border-gray-300'
                                }`}
                              placeholder="Enter team 2 name"
                            />
                            {errors.team2 && touched.team2 && (
                              <p className="mt-1 text-sm text-red-600">{errors.team2}</p>
                            )}
                          </div>
                        </div>

                        {/* Overs */}
                        <div>
                          <label htmlFor="maxOver" className="block text-sm font-medium text-gray-700 mb-2">
                            How many overs?*
                          </label>
                          <input
                            id="maxOver"
                            name="maxOver"
                            type="number"
                            value={values.maxOver}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.maxOver && touched.maxOver ? 'border-red-500' : 'border-gray-300'
                              }`}
                            placeholder="Enter number of overs"
                            min="1"
                          />
                          {errors.maxOver && touched.maxOver && (
                            <p className="mt-1 text-sm text-red-600">{errors.maxOver}</p>
                          )}
                        </div>

                        {/* Batting Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Who is Batting?*
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="batting"
                                value={values.team1}
                                checked={values.batting === values.team1}
                                onChange={(event) => {
                                  setFieldValue('batting', event.currentTarget.value)
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                disabled={!values.team1}
                              />
                              <span className="ml-2 text-gray-700">
                                {values.team1 || 'Team 1'}
                              </span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="batting"
                                value={values.team2}
                                checked={values.batting === values.team2}
                                onChange={(event) => {
                                  setFieldValue('batting', event.currentTarget.value)
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                disabled={!values.team2}
                              />
                              <span className="ml-2 text-gray-700">
                                {values.team2 || 'Team 2'}
                              </span>
                            </label>
                          </div>
                          {errors.batting && touched.batting && (
                            <p className="mt-1 text-sm text-red-600">{errors.batting}</p>
                          )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                          <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? 'Starting...' : 'Start Game'}
                          </button>
                        </div>
                      </form>
                    )
                  }}
                </Formik>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HorizontalStepper