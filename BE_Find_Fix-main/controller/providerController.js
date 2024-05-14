const ProviderModel = require('../models/provider');
const ServiceModel = require('../models/service');
const OrderModel = require('../models/order');
const ReviewModel = require('../models/review');
const providerController = {};

providerController.createProvider = async (req, res) => {
  try {
    // Extracting text fields from the request body
    const { title, description, address, phone } = req.body;
    // The image file will be in req.file due to multer
    const imageFile = req.file;
    // Add providers data
    const providerData = {
      title, // defaults to "" if empty
      description, // defaults to "" if empty
      address,// defaults to "" if empty
      phone, // defaults to "" if empty
    };
    const docRef = await ProviderModel.registerProvider(providerData);
    let storeimageurl = null;
    // Upload image to Firebase Storage if it exists
    if (imageFile) {
      storeimageurl = await ProviderModel.storeimageUrl(docRef, imageFile);
    }
    if (storeimageurl) {
      res.status(200).json({ code: 200, status: "Provider Created" });
    }
  } catch (error) {
    res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
  }
};

providerController.getProviderById = async (req, res) => {
  try {
    const providerId = req.params.id;
    const provider = await ProviderModel.getProviderById(providerId);

    if (!provider) {
      res.status(404).json({ code: 404, status: "Not Found", message: "Provider not found" });
      return;
    }

    const services = await ServiceModel.getServicesByProviderId(providerId);
    // Use Promise.all to handle asynchronous operations within map
    const enhancedServices = await Promise.all(services.map(async (service) => {
      // Fetch orders related to the service and calculate reviews data
      const orderIds = await OrderModel.getServiceOrders(service.id);
      const reviewsData = orderIds.length > 0
        ? await ReviewModel.getRatingByOrderIds(orderIds)
        : { averageRating: 0, totalReviews: 0 };

      return {
        ...service,
        providerTitle: provider.title,
        providerAddress: provider.address,
        averageRating: reviewsData.averageRating,
        totalReviews: reviewsData.totalReviews,
      };
    }));

    // Attach the enhanced services to the provider object
    provider.services = enhancedServices;

    res.status(200).json({ code: 200, status: "OK", provider });
  } catch (error) {
    console.error("Error fetching provider:", error);
    res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
  }
};

module.exports = providerController;