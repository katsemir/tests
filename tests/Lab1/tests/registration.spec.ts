import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/registrationPage';
import { testUser } from '../utils/testData';

test('Реєстрація користувача через форму', async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  // arrange
  await registrationPage.goto();

  // act
  await registrationPage.fillForm(testUser);
  await registrationPage.submitForm();

  // assert
  await registrationPage.expectSuccessModal();
  await expect(page.locator('#example-modal-sizes-title-lg')).toHaveText('Thanks for submitting the form');
});