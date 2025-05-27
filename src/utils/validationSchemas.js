import * as yup from "yup";

export const loginValidationSchema = yup.object().shape({
  email: yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      ('Enter a valid email address')
    )
    .required(('Email is required')),
  password: yup
    .string('Enter your password')
    .required(('Password is required'))
});

export const addItem = yup.object().shape({
  name: yup.string().required('Name is required'),
  phone: yup.string()
  .nullable()
  .notRequired()
  .test(
    'len',
    'Must be between 9 and 15 digits',
    val => !val || (val.length >= 9 && val.length <= 15)
  ),

  // phone: yup.string()
  //   .nullable()
  //   .notRequired()
  //   .min(9, "Must be at least 9 digits")
  //   .max(15, "Must be at most 15 digits"),
  image: yup.mixed().required('Image is required'),
  role: yup.string().required('Select the role'),
});

export const addClientValidationSchema = (handleCheckIsEmailAlreadyExist) => yup.object().shape({
  name: yup.string('Enter your Name').required(('Name is required')),
  lastName: yup.string('Enter your Surname').required(('Surname is required')),
  email: yup.string()
  .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    ('Enter a valid email address')
  )
  .required(('Email is required'))
  .test(
    'is-email-unique',
    ('Email already exists!'),
    async (value) => await handleCheckIsEmailAlreadyExist(value)
  ),
  // phone: yup.string()
  // .nullable()
  // .notRequired()
  // .min(9, i18n.t("Must be at least 9 digits"))
  // .max(15, i18n.t("Must be at most 15 digits")),
  // zipcode: yup.string('Enter Zipcode')
  // .required(i18n.t('Zipcode is required'))
  // .matches(/^\d{5}$/, i18n.t('Zipcode must be exactly 5 digits')),
});

export const addQuoteRequestValidationSchema = yup.object().shape({
  jobTitle: yup.string().required(('Job Title is required')),
  clientId: yup.string().nullable().when(['clientData.name', 'clientData.email'], {
    is: (name, email) => !name && !email, // If name and email are empty, clientId is required
    then: (schema) => schema.required("Client is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // clientData: yup.object().shape({
  //   name: yup.string().when('clientId', {
  //     is: (clientId) => !clientId, // If clientId is empty, name is required
  //     then: (schema) => schema.required("Name is required"),
  //     otherwise: (schema) => schema.notRequired(),
  //   }),
  //   lastName: yup.string().when('clientId', {
  //     is: (clientId) => !clientId, // If clientId is empty, lastName is required
  //     then: (schema) => schema.required("Last name is required"),
  //     otherwise: (schema) => schema.notRequired(),
  //   }),
  //   email: yup.string().email("Invalid email").when('clientId', {
  //     is: (clientId) => !clientId, // If clientId is empty, email is required
  //     then: (schema) => schema.required("Email is required"),
  //     otherwise: (schema) => schema.notRequired(),
  //   }),
  //   phone: yup
  //     .string()
  //     .nullable()
  //     .notRequired()
  //     .min(10, i18n.t("Must be more than 10 characters"))
  //     .max(20, i18n.t("Must be less than 20 characters")),
  //   zipcode: yup.string().when('clientId', {
  //     is: (clientId) => !clientId, // If clientId is empty, zipcode is required
  //     then: (schema) => schema.required(i18n.t("Zipcode is required")),
  //     otherwise: (schema) => schema.notRequired(),
  //   }),
  // }),

  contactTimePreference: yup.string().required("Contact Time Preference is required"),
  startOfWork: yup.string().required("Start of work is required"),
  // notes: yup.string().required("Notes is required"),
});

export const addSupplierValidationSchema = (handleCheckIsEmailAlreadyExist) =>
  yup.object().shape({
    name: yup.string().required(('Name is required')),

    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        ('Enter a valid email address')
      )
      .required(('Email is required'))
      .test(
        'is-email-unique',
        ('Email already exists!'),
        async (value) => await handleCheckIsEmailAlreadyExist(value)
      ),

    phone: yup.string()
      .nullable()
      .notRequired()
      .min(9,("Must be at least 9 digits"))
      .max(15,("Must be at most 15 digits")),

    websiteUrl: yup
      .string()
      .matches(
        /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/,
        ('Enter a valid URL')
      )
      .nullable()
      .notRequired(),

    address1: yup.string().required(('Address Line 1 is required')),
    address2: yup.string().nullable().notRequired(),

    city: yup.string().required(('City is required')),
    state: yup.string().required(('State is required')),
    country: yup.string().required(('Country is required')),

    zipcode: yup.string('Enter Zipcode')
    .required(('Zipcode is required'))
    .matches(/^\d{5}$/, ('Zipcode must be exactly 5 digits')),

    companyHistory: yup.string().nullable().notRequired(),

    // servicesOffered: yup.string().nullable().notRequired(),
});

export const addArchitectValidationSchema = (handleCheckIsEmailAlreadyExist) =>
  yup.object().shape({
    name: yup.string().required(('Name is required')),

    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        ('Enter a valid email address')
      )
      .required(('Email is required'))
      .test(
        'is-email-unique',
        ('Email already exists!'),
        async (value) => await handleCheckIsEmailAlreadyExist(value)
      ),

    description: yup.string().nullable().notRequired(),
});

export const createOfferValidationSchema = yup.object().shape({
  jobTitle: yup.string().required("Job Title is required"),
  offers: yup
    .array()
    .min(1, "At least one offer is required") 
    .of(
      yup.object().shape({
        supplierId: yup.string().required("Supplier required"),
        price: yup
        .number()
        .typeError("Price must be a number")
        .positive("Price must be greater than zero")
        .required("Price is required"),
        notes: yup.string(),
        expirationDate: yup.mixed()
        .nullable().required("Expiration date is required"),
      })
    ),
});

export const forgotPasswordValidationSchema = yup.object({
  email: yup.string()
      .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          ('Enter a valid email address')
      )
      .required(('Email is required')),
});

export const updateProfileValidationSchema = yup.object().shape({
  name: yup.string().required(('First Name is required')),
  email: yup.string()
      .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          ('Enter a valid email address')
      )
      .required(('Email is required')),
  phone: yup.string()
      .matches(
          /^(?:\d[\d -]*){1,10}$/,
          ('Enter a valid phone number with up to 10 digits')
      )
  // .required('Phone number is required')    
});

export const changePasswordValidationSchema = (handleCheckCurrentPassword) =>
  yup.object().shape({
      oldPassword: yup.string().required(('Current Password is required'))
          .test('is-valid', ('Current Password is wrong!'), value => handleCheckCurrentPassword(value)),
      password: yup.string()
          .min(8,('New Password must be at least 8 characters'))
          .matches(/[a-z]/, ('New Password must contain at least one lowercase letter'))
          .matches(/[A-Z]/,('New Password must contain at least one uppercase letter'))
          .matches(/[0-9]/,('New Password must contain at least one number'))
          .matches(/[!@#$%^&*(),.?":{}|<>]/,('New Password must contain at least one special character'))
          .required(('New Password is required')),
      confirmNewPassword: yup.string()
          .oneOf([yup.ref('password'), null], ('Passwords must match'))
          .required(('Confirm New Password is required')),
});

export const addMilestoneValidationSchema = yup.object().shape({
  milestones: yup
    .array()
    .min(1, "At least one milestone is required") 
    .of(
      yup.object().shape({
        title: yup.string().required("Milestone title is required"),
        amount: yup
        .number()
        .typeError("Amount must be a number")
        .positive("Amount must be greater than zero")
        .required("Amount is required"),
        dueDate: yup.mixed()
        .nullable().required("Due date is required"),
      })
    ),
});