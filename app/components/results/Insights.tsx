import React from 'react'

interface InsightsProps {
  response: {
    points: string[]
  }
}

const Insights: React.FC<InsightsProps> = ({ response }) => {
  console.log('AI Insights response:', response);
  return (
    <div id="insights" className='grid grid-cols-1 md:grid-cols-2 md:gap-x-12 pb-20'>
      <div>AI insights</div>
      <div>
        {response.points.map((point, index) => (
          <p key={index} className="text-gray-600 text-base">{point}</p>
        ))}
      </div>
    </div>
  )
}

export default Insights