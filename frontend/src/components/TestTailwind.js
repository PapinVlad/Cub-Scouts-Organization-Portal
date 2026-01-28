const TestTailwind = () => {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4 mt-8">
      <div className="shrink-0">
        <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white font-bold">TS</span>
        </div>
      </div>
      <div>
        <div className="text-xl font-medium text-secondary">Tailwind Test</div>
        <p className="text-text-secondary">If you see this card styled properly, Tailwind is working!</p>
      </div>
    </div>
  )
}

export default TestTailwind
