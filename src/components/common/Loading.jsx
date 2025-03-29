const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      <p className="ml-4 text-lg font-medium">Loading...</p>
    </div>
  );
};

export default Loading;
