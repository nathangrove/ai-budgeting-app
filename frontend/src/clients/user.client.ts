
export async function checkLoggedIn() {
    try {
        
      const response = await fetch('/api/isLoggedIn', {
        method: 'GET',
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Logged in successfully', userData);
        return userData.user
      } else {
        console.error('Login failed');
        return false;
      }
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}
