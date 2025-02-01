// Simple function that adds two numbers
const addNumbers = (a, b) => {
    if (a == null || b == null) {
      throw new Error("Both numbers are required!"); // Error if one of the numbers is missing
    }
    return a + b;
  };
  
  // A wrapper to catch errors
  const asyncHandler = (fn) => {
    return (a,b) => {
      try {
        const result = fn(a, b); // Call the original function
        console.log("Result:", result); // If no error, print the result
      } catch (error) {
        console.error("Error:", error.message); // If error happens, print the error message
      }
    };
  };
  
  // Wrap the addNumbers function with asyncHandler
  const safeAddNumbers = asyncHandler(addNumbers);
  
  // Call the wrapped function
  safeAddNumbers(5, 10);  // ✅ This works, prints: Result: 15
  safeAddNumbers(5);      // ❌ This fails, prints: Error: Both numbers are required!
  