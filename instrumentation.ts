export async function register() {

  if (
    process.env.NEXT_RUNTIME === "nodejs"
  ) {

    const {
      bootKernel,
    } = await import(
      "@/platform/kernel/boot"
    );

    bootKernel();

  }

}
