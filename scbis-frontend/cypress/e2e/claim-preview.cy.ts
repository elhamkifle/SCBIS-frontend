// claim-preview.cy.ts
describe('Claim Preview and Submission', () => {
  beforeEach(() => {
    // Mock API responses and set up initial state
    cy.intercept('POST', 'https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/claims', {
      statusCode: 200,
      body: { success: true }
    }).as('submitClaim');

    // Mock auth token
    cy.setCookie('auth_token', 'mock-auth-token');

    // Visit the page with necessary query params or state
    cy.visit('http://localhost:3000/claim-submission/preview', {
      onBeforeLoad(win) {
        // Set initial Zustand store states
        win.localStorage.setItem('/claim-policy-selection-storage', JSON.stringify({
          selectedPolicy: 'policy123',
          policies: [{
            _id: 'policy123',
            title: 'Comprehensive Auto Policy',
            privateVehicle: {
              generalDetails: {
                make: 'Toyota',
                model: 'Camry',
                plateNumber: 'ABC123'
              }
            }
          }]
        }));

        win.localStorage.setItem('driver-details-storage', JSON.stringify({
          isDriverSameAsInsured: false,
          formData: {
            firstName: 'John',
            lastName: 'Doe',
            age: '30',
            city: 'Addis Ababa',
            subCity: 'Bole',
            kebele: '08',
            phoneNumber: '0912345678',
            licenseNo: 'ET123456',
            grade: '1',
            expirationDate: '2025-12-31'
          }
        }));

        // Set other necessary store states...
      }
    });
  });

  it('should display all claim information sections', () => {
    // Verify all sections are visible
    cy.contains('Claim Submission Preview').should('be.visible');
    cy.contains('Selected Policy: policy123').should('be.visible');
    cy.contains('Selected Vehicle: Toyota Camry').should('be.visible');
    cy.contains('Driver Details').should('be.visible');
    cy.contains('Accident Details').should('be.visible');
    cy.contains('Liability Information').should('be.visible');
    cy.contains('Damage Information').should('be.visible');
    cy.contains('Witness Information').should('be.visible');
  });

  it('should allow editing driver details', () => {
    cy.contains('Driver Details').parent().within(() => {
      cy.get('button').click(); // Click edit button
      
      // Verify edit mode
      cy.contains('Same as insured').should('be.visible');
      cy.contains('Different driver').should('be.visible');
      
      // Make changes
      cy.get('input[name="firstName"]').clear().type('Jane');
      cy.get('input[name="lastName"]').clear().type('Smith');
      
      // Save changes
      cy.get('button').click();
    });

    // Verify changes persisted
    cy.contains('First Name: Jane').should('be.visible');
    cy.contains('Last Name: Smith').should('be.visible');
  });

  it('should allow editing accident details', () => {
    cy.contains('Accident Details').parent().within(() => {
      cy.get('button').click(); // Click edit button
      
      // Make changes
      cy.contains('Left Side of Lane').click();
      cy.contains('Asphalt').click();
      cy.contains('Heavy Traffic').click();
      
      // Save changes
      cy.get('button').click();
    });

    // Verify changes persisted
    cy.contains('Position on Road: Left Side of Lane').should('be.visible');
    cy.contains('Road Surface: Asphalt').should('be.visible');
    cy.contains('Traffic Condition: Heavy Traffic').should('be.visible');
  });

  it('should allow editing liability information', () => {
    cy.contains('Liability Information').parent().within(() => {
      cy.get('button').click(); // Click edit button
      
      // Make changes
      cy.contains('The other person').click();
      cy.contains('Yes , they are').click();
      cy.get('input[type="text"]').first().type('ABC Insurance');
      
      // Save changes
      cy.get('button').click();
    });

    // Verify changes persisted
    cy.contains('Responsible Party: The other person').should('be.visible');
    cy.contains('Other Vehicle Insured: Yes , they are').should('be.visible');
    cy.contains('Insurance Company: ABC Insurance').should('be.visible');
  });

  it('should allow editing damage information', () => {
    cy.contains('Damage Information').parent().within(() => {
      cy.get('button').click(); // Click edit button
      
      // Make changes
      cy.get('textarea').first().type('Front bumper damage');
      cy.contains('Yes').click();
      cy.get('input[type="text"]').first().type('Injured Person');
      
      // Save changes
      cy.get('button').click();
    });

    // Verify changes persisted
    cy.contains('Vehicle Damage Description: Front bumper damage').should('be.visible');
    cy.contains('Injuries: Yes').should('be.visible');
    cy.contains('Injured Person: Injured Person').should('be.visible');
  });

  it('should allow editing witness information', () => {
    cy.contains('Witness Information').parent().within(() => {
      cy.get('button').click(); // Click edit button
      
      // Make changes
      cy.contains("No I wasn't alone").click();
      cy.contains('Add Occupant').click();
      cy.get('input[type="text"]').first().type('Passenger Name');
      
      // Save changes
      cy.get('button').click();
    });

    // Verify changes persisted
    cy.contains("Alone in Vehicle: No I wasn't alone").should('be.visible');
    cy.contains('Vehicle Occupants:').should('be.visible');
    cy.contains('Name: Passenger Name').should('be.visible');
  });

  it('should successfully submit the claim', () => {
    // Stub the API call
    cy.intercept('POST', 'https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/claims', {
      statusCode: 200,
      body: { success: true }
    }).as('submitClaim');

    cy.contains('Submit Claim').click();

    // Verify API call was made
    cy.wait('@submitClaim').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        policyId: 'policy123',
        isDriverSameAsInsured: false,
        driver: {
          firstName: 'John',
          lastName: 'Doe',
          age: '30',
          city: 'Addis Ababa',
          subCity: 'Bole',
          kebele: '08',
          phoneNumber: '0912345678',
          licenseNo: 'ET123456',
          grade: '1',
          expirationDate: '2025-12-31'
        },
        // Verify other expected request body fields...
      });
    });

    // Verify success behavior
    cy.url().should('include', '/dashboard');
    cy.contains('Claim submitted successfully!').should('be.visible');
  });

  it('should handle submission errors', () => {
    // Stub a failed API call
    cy.intercept('POST', 'https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/claims', {
      statusCode: 500,
      body: { error: 'Submission failed' }
    }).as('submitClaim');

    cy.contains('Submit Claim').click();

    // Verify error handling
    cy.contains('Submission failed').should('be.visible');
  });

  it('should navigate back to declaration page', () => {
    cy.contains('Previous').click();
    cy.url().should('include', '/claim-submission/declaration');
  });
});