import environmentVariables from '../../config/environmentVariables';
import {
  checkLoginToken,
  createAuthAccount,
  deleteAccount,
  requestResetPassword,
  signInWithEmailAndPassword,
  signOutAllAcounts,
  updateEmailAndPassword,
} from './firebaseAuth';

jest.setTimeout(100000);

const testEmail = 'leon_lts@hotmail.com';
const testPassword = 'testtest';

test('create an account + check login token + delete account', async () => {
  const createAccountResult = await createAuthAccount(testEmail, testPassword);
  expect(createAccountResult.success).toBe(true);

  if (!createAccountResult.success) throw createAccountResult.error;

  const checkLoginTokenResult = await checkLoginToken(
    createAccountResult.data.token
  );
  expect(
    checkLoginTokenResult.success &&
      checkLoginTokenResult.data.email === testEmail
  ).toBe(true);

  const deleteAccountResult = await deleteAccount(
    createAccountResult.data.token
  );
  expect(deleteAccountResult.success).toBe(true);
});

test('create an account + revoke token + check token + verification email + reset password email + signIn + delete account', async () => {
  const createAccountResult = await createAuthAccount(testEmail, testPassword);
  expect(createAccountResult.success).toBe(true);

  if (!createAccountResult.success) throw createAccountResult.error;

  const revokeTokenResult = await signOutAllAcounts(
    createAccountResult.data.token
  );
  expect(revokeTokenResult.success).toBe(true);

  const checkLoginTokenResult = await checkLoginToken(
    createAccountResult.data.token
  );
  expect(checkLoginTokenResult.success).toBe(false);

  const signInResult = await signInWithEmailAndPassword(
    testEmail,
    testPassword,
    true
  );
  expect(
    signInResult.success &&
      signInResult.data.userId === createAccountResult.data.userId &&
      signInResult.data.token !== createAccountResult.data.token
  ).toBe(true);
  if (!signInResult.success) throw signInResult.error;

  if (environmentVariables().ENV === 'LOCAL') {
    await expect(requestResetPassword(testEmail)).rejects.toThrow();
  } else {
    const requestResetPasswordResult = await requestResetPassword(testEmail);
    expect(requestResetPasswordResult).toStrictEqual({
      success: true,
      data: null,
    });
  }

  const deleteAccountResult = await deleteAccount(signInResult.data.token);
  expect(deleteAccountResult.success).toBe(true);

  const checkLoginTokenAfterDeleteResult = await checkLoginToken(
    createAccountResult.data.token
  );
  expect(checkLoginTokenAfterDeleteResult.success).toBe(false);
});

test('create an account + update email and password + signIn + delete', async () => {
  const createAccountResult = await createAuthAccount(testEmail, testPassword);
  expect(createAccountResult.success).toBe(true);

  if (!createAccountResult.success) throw createAccountResult.error;

  const updatedEmail = 'test2@test.com';
  const updatedPassword = 'test2test2';
  const updateEmailAndPasswordResult = await updateEmailAndPassword(
    createAccountResult.data.token,
    updatedEmail,
    updatedPassword
  );
  expect(
    updateEmailAndPasswordResult.success &&
      updateEmailAndPasswordResult.data.userId ===
        createAccountResult.data.userId
  ).toBe(true);
  if (!updateEmailAndPasswordResult.success)
    throw updateEmailAndPasswordResult.error;

  const checkLoginTokenResult = await checkLoginToken(
    updateEmailAndPasswordResult.data.token
  );
  expect(
    checkLoginTokenResult.success &&
      checkLoginTokenResult.data.email === updatedEmail
  ).toBe(true);

  const signInPreviousAccountResult = await signInWithEmailAndPassword(
    testEmail,
    testPassword
  );
  expect(signInPreviousAccountResult.success).toBe(false);

  const signInResult = await signInWithEmailAndPassword(
    updatedEmail,
    updatedPassword
  );
  expect(
    signInResult.success &&
      signInResult.data.userId === updateEmailAndPasswordResult.data.userId
  ).toBe(true);

  if (!signInResult.success) throw signInResult.error;

  const deleteAccountResult = await deleteAccount(signInResult.data.token);
  expect(deleteAccountResult.success).toBe(true);
});
